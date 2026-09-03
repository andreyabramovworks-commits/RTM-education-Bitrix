from __future__ import annotations

from datetime import date, datetime, timedelta, timezone
import hashlib
import logging
import mimetypes
from pathlib import Path
import re
import secrets
from typing import Annotated, Any
from urllib.parse import urlencode, urlparse

import httpx
from cryptography.fernet import Fernet, InvalidToken
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import FileResponse, HTMLResponse
from pydantic import BaseModel, Field
from sqlmodel import Session, select

from app.bitrix_auth import BitrixIdentity, bitrix_call, require_bitrix_identity, require_developer, require_editor
from app.config import get_settings
from app.database import get_session
from app.document_composer import compose, materialize_images
from app.knowledge import _allows
from app.models import (
    AcknowledgementAssignment, AcknowledgementCampaign, AcknowledgementEvent, AppUser,
    BitrixDepartment, GoogleOAuthCredential, GoogleOAuthState, KnowledgeDocument,
    KnowledgeDocumentRender, KnowledgeEdition, UserHelpPreference, utcnow,
)

router = APIRouter(prefix="/api/v51", tags=["v51"])
GOOGLE_SCOPE = "https://www.googleapis.com/auth/documents.readonly https://www.googleapis.com/auth/drive.readonly"
MANAGER_ROLES = {"developer", "admin", "editor", "teacher"}
logger = logging.getLogger(__name__)
TASK_TITLE_TEMPLATE = "Ознакомиться: {document_title}"
TASK_DESCRIPTION_TEMPLATE = (
    "Нужно ознакомиться с обязательным документом «{document_title}».\n\n"
    "Редакция от {edition_date}.\n"
    "Срок: {deadline}.\n\n"
    "Что изменилось:\n{changes}\n\n"
    "Открыть нужную редакцию в RTM Education:\n{edition_link}"
)
TASK_TEMPLATE_FIELDS = {"document_title", "edition_date", "deadline", "changes", "edition_link"}


class EditionWrite(BaseModel):
    editionDate: date
    googleRevisionId: str = ""
    googleVersionName: str = ""
    changeLog: str = Field(min_length=1, max_length=30000)


class EditionDeleteWrite(BaseModel):
    """Server-side confirmation prevents accidental deletion of a launched test edition."""
    confirmationDate: date


class CampaignWrite(BaseModel):
    mode: str = "confirm"
    question: dict[str, Any] = Field(default_factory=dict)
    testKind: str = ""
    recipientRules: list[dict[str, Any]] = Field(default_factory=list)
    responsibleRules: list[dict[str, Any]] = Field(default_factory=list)
    dueDays: int = Field(default=7, ge=0, le=3650)
    includeNewHires: bool = False
    notificationSettings: dict[str, Any] = Field(default_factory=lambda: {"inApp": True, "bitrix": True, "task": True, "escalation": True})


class ActiveCampaignWrite(BaseModel):
    recipientRules: list[dict[str, Any]] = Field(default_factory=list)
    responsibleRules: list[dict[str, Any]] = Field(default_factory=list)
    dueDays: int = Field(default=7, ge=0, le=3650)
    dueDatePolicy: str = "new_only"
    includeNewHires: bool = False


class AnswerWrite(BaseModel):
    answer: Any = None


class ReviewWrite(BaseModel):
    accepted: bool
    comment: str = Field(default="", max_length=5000)


class ManualCompleteWrite(BaseModel):
    reason: str = Field(min_length=3, max_length=5000)


class ExemptWrite(BaseModel):
    reason: str = Field(min_length=3, max_length=5000)


class CloseCampaignWrite(BaseModel):
    reason: str = Field(min_length=3, max_length=5000)


class HelpPreferenceWrite(BaseModel):
    hidden: bool


def _iso(value: datetime | date | None) -> str | None:
    return value.isoformat() if value else None


def _name(user: AppUser | None) -> str:
    if not user:
        return ""
    return " ".join(part for part in (user.first_name, user.last_name) if part).strip() or user.email or f"ID {user.bitrix_user_id}"


def _edition(row: KnowledgeEdition) -> dict[str, Any]:
    return {"id": row.id, "documentId": row.document_id, "editionDate": _iso(row.edition_date), "googleRevisionId": row.google_revision_id,
            "googleVersionName": row.google_version_name, "changeLog": row.change_log, "createdBy": row.created_by,
            "createdAt": _iso(row.created_at), "updatedAt": _iso(row.updated_at)}


def _campaign(row: AcknowledgementCampaign) -> dict[str, Any]:
    return {"id": row.id, "editionId": row.edition_id, "mode": row.mode, "question": row.question, "testKind": row.test_kind,
            "recipientRules": row.recipient_rules, "responsibleRules": row.responsible_rules, "dueDays": row.due_days,
            "includeNewHires": row.include_new_hires, "notificationSettings": row.notification_settings, "status": row.status,
            "launchedAt": _iso(row.launched_at), "closedAt": _iso(row.closed_at), "createdAt": _iso(row.created_at)}


def _due_at(started_at: datetime, due_days: int) -> datetime:
    """Calendar-day deadline: assignment day + N days, through the end of that day."""
    target = (started_at + timedelta(days=due_days)).date()
    return datetime.combine(target, datetime.max.time(), tzinfo=started_at.tzinfo or timezone.utc)


def _validate_campaign(payload: CampaignWrite, document: KnowledgeDocument) -> None:
    if not payload.recipientRules:
        raise HTTPException(422, "Выберите хотя бы одного получателя")
    if not payload.responsibleRules:
        raise HTTPException(422, "Выберите хотя бы одного ответственного")
    if payload.mode not in {"confirm", "question", "test"}:
        raise HTTPException(422, "Способ ознакомления должен быть: подтверждение, контрольный вопрос или тест")
    if payload.mode == "question":
        question_type = str(payload.question.get("type") or "single")
        if question_type not in {"single", "multiple", "free"} or not str(payload.question.get("text") or "").strip():
            raise HTTPException(422, "Заполните контрольный вопрос и выберите допустимый тип ответа")
        if question_type != "free":
            options = payload.question.get("options") or []
            correct = payload.question.get("correct") or []
            if len(options) < 2 or not correct:
                raise HTTPException(422, "Добавьте минимум два варианта и отметьте правильный ответ")
    if payload.mode == "test":
        if payload.testKind not in {"light", "full"}:
            raise HTTPException(422, "Выберите связанный тест документа")
        test = document.light_test if payload.testKind == "light" else document.full_test
        if not (test or {}).get("created"):
            raise HTTPException(422, "Выбранный тест этого документа ещё не создан")
        if not (test or {}).get("questions"):
            raise HTTPException(422, "Linked test must contain at least one question")
    settings = payload.notificationSettings or {}
    for key in ("bitrix", "task", "escalation"):
        if key in settings and not isinstance(settings[key], bool):
            raise HTTPException(422, f"Параметр {key} должен быть переключателем")
    title = str(settings.get("taskTitle") or TASK_TITLE_TEMPLATE)
    description = str(settings.get("taskDescription") or TASK_DESCRIPTION_TEMPLATE)
    if len(title) > 250:
        raise HTTPException(422, "Название задачи не должно превышать 250 символов")
    if len(description) > 10000:
        raise HTTPException(422, "Описание задачи не должно превышать 10000 символов")
    unknown = (set(re.findall(r"\{([a-z_]+)\}", title + "\n" + description)) - TASK_TEMPLATE_FIELDS)
    if unknown:
        raise HTTPException(422, "Неизвестные переменные шаблона: " + ", ".join(sorted(unknown)))


def _render_task_template(template: str, values: dict[str, str]) -> str:
    return re.sub(r"\{([a-z_]+)\}", lambda match: values.get(match.group(1), match.group(0)), template)


def _department_map(session: Session) -> dict[str, BitrixDepartment]:
    return {row.bitrix_department_id: row for row in session.exec(select(BitrixDepartment).where(BitrixDepartment.active == True)).all()}  # noqa: E712


def _is_in_department(user: AppUser, department_id: str, include_children: bool, departments: dict[str, BitrixDepartment]) -> bool:
    own = {str(value) for value in user.department_ids or []}
    if department_id in own:
        return True
    if not include_children:
        return False
    for own_id in own:
        current = departments.get(own_id)
        visited: set[str] = set()
        while current and current.parent_id and current.parent_id not in visited:
            if current.parent_id == department_id:
                return True
            visited.add(current.parent_id)
            current = departments.get(current.parent_id)
    return False


def _match_rules(user: AppUser, rules: list[dict[str, Any]], departments: dict[str, BitrixDepartment]) -> bool:
    for rule in rules:
        kind, value = str(rule.get("type") or ""), str(rule.get("id") or "")
        if kind == "all_active" and user.active:
            return True
        if kind == "user" and value in {str(user.id), user.bitrix_user_id}:
            return True
        if kind == "role" and value == user.role:
            return True
        if kind == "department" and _is_in_department(user, value, bool(rule.get("includeChildren", True)), departments):
            return True
    return False


def _recipient_users(session: Session, rules: list[dict[str, Any]]) -> list[AppUser]:
    departments = _department_map(session)
    return [user for user in session.exec(select(AppUser).where(AppUser.active == True)).all() if _match_rules(user, rules, departments)]  # noqa: E712


def _can_manage(identity: BitrixIdentity, campaign: AcknowledgementCampaign, departments: dict[str, BitrixDepartment] | None = None) -> bool:
    if identity.user.role in {"developer", "admin", "editor"}:
        return True
    rules = campaign.responsible_rules or []
    return _match_rules(identity.user, rules, departments or {})


def _event(session: Session, campaign_id: int, event_type: str, *, assignment: AcknowledgementAssignment | None = None,
           user_id: int | None = None, actor_id: int | None = None, details: dict[str, Any] | None = None) -> None:
    session.add(AcknowledgementEvent(campaign_id=campaign_id, assignment_id=assignment.id if assignment else None,
                                     user_id=user_id if user_id is not None else (assignment.user_id if assignment else None),
                                     actor_id=actor_id, event_type=event_type, details=details or {}))


def _maybe_close_campaign(session: Session, campaign_id: int) -> None:
    campaign = session.get(AcknowledgementCampaign, campaign_id)
    if not campaign or campaign.status != "active":
        return
    rows = session.exec(select(AcknowledgementAssignment).where(AcknowledgementAssignment.campaign_id == campaign_id)).all()
    if rows and all(row.status in {"completed", "exempted"} for row in rows):
        campaign.status = "closed"
        campaign.closed_at = utcnow()
        campaign.updated_at = campaign.closed_at
        session.add(campaign)
        _event(session, campaign.id, "campaign_closed", details={"automatic": True})


def _assignment_link(assignment: AcknowledgementAssignment) -> str:
    origin = get_settings().public_origin.rstrip("/")
    return f"{origin}/bitrix/app?rtm_assignment={assignment.id}"


def _deliver_assignment(
    session: Session,
    identity: BitrixIdentity,
    campaign: AcknowledgementCampaign,
    assignment: AcknowledgementAssignment,
    user: AppUser,
    document: KnowledgeDocument,
    edition: KnowledgeEdition,
) -> dict[str, Any] | None:
    link = _assignment_link(assignment)
    due = assignment.due_at
    due_text = due.strftime("%d.%m.%Y") if due else "без срока"
    message = f"Нужно ознакомиться: {document.title}. Срок: {due_text}. Открыть: {link}"
    settings = campaign.notification_settings or {}
    template_values = {
        "document_title": document.title,
        "edition_date": edition.edition_date.strftime("%d.%m.%Y"),
        "deadline": due_text,
        "changes": edition.change_log,
        "edition_link": link,
    }
    task_title = _render_task_template(str(settings.get("taskTitle") or TASK_TITLE_TEMPLATE), template_values)
    description = _render_task_template(str(settings.get("taskDescription") or TASK_DESCRIPTION_TEMPLATE), template_values)
    try:
        if settings.get("bitrix", True):
            bitrix_call(identity, "im.notify.personal.add", {"to": int(user.bitrix_user_id), "message": message})
        if settings.get("task", True):
            bitrix_call(identity, "tasks.task.add", {"fields": {
                "TITLE": task_title,
                "RESPONSIBLE_ID": int(user.bitrix_user_id),
                "DESCRIPTION": description,
                "DEADLINE": due.isoformat() if due else None,
            }})
        _event(session, campaign.id, "notification_sent", assignment=assignment, actor_id=identity.user.id,
               details={"channels": {"bitrix": bool(settings.get("bitrix", True)), "task": bool(settings.get("task", True))}})
        logger.info("acknowledgement delivery completed", extra={"campaign_id": campaign.id, "assignment_id": assignment.id})
        return None
    except Exception as exc:  # assignment must survive a Bitrix delivery issue
        failure = {"userId": user.bitrix_user_id, "message": str(getattr(exc, "detail", exc))}
        _event(session, campaign.id, "notification_failed", assignment=assignment, actor_id=identity.user.id, details=failure)
        logger.warning("acknowledgement delivery failed", extra={"campaign_id": campaign.id, "assignment_id": assignment.id, "error_type": type(exc).__name__})
        return failure


def _add_assignment(
    session: Session,
    campaign: AcknowledgementCampaign,
    user: AppUser,
    *,
    actor_id: int | None = None,
    event_type: str = "assigned",
) -> AcknowledgementAssignment:
    now = utcnow()
    assignment = AcknowledgementAssignment(
        campaign_id=campaign.id,
        user_id=user.id,
        assigned_at=now,
        due_at=_due_at(now, campaign.due_days),
    )
    session.add(assignment)
    session.flush()
    _event(session, campaign.id, event_type, assignment=assignment, actor_id=actor_id)
    return assignment


def _nearest_manager(session: Session, user: AppUser) -> AppUser | None:
    departments = _department_map(session)
    candidates = {row.bitrix_user_id: row for row in session.exec(select(AppUser).where(AppUser.active == True)).all()}  # noqa: E712
    for department_id in [str(value) for value in user.department_ids or []]:
        current = departments.get(department_id)
        visited: set[str] = set()
        while current and current.bitrix_department_id not in visited:
            visited.add(current.bitrix_department_id)
            manager = candidates.get(str(current.head_user_id or ""))
            if manager and manager.id != user.id:
                return manager
            current = departments.get(str(current.parent_id or ""))
    return None


def _send_reminder(session: Session, identity: BitrixIdentity, row: AcknowledgementAssignment, *, automatic: bool = False) -> dict[str, Any]:
    user = session.get(AppUser, row.user_id)
    campaign = session.get(AcknowledgementCampaign, row.campaign_id)
    edition = session.get(KnowledgeEdition, campaign.edition_id) if campaign else None
    document = session.get(KnowledgeDocument, edition.document_id) if edition else None
    if not user or not document:
        raise HTTPException(404, "Сотрудник или документ не найден")
    recipients = [user]
    manager = _nearest_manager(session, user) if row.status == "overdue" and (campaign.notification_settings or {}).get("escalation", True) else None
    if row.status == "overdue" and not manager and (campaign.notification_settings or {}).get("escalation", True):
        departments = _department_map(session)
        candidates = session.exec(select(AppUser).where(AppUser.active == True)).all()  # noqa: E712
        manager = next((candidate for candidate in candidates if candidate.id != user.id and _match_rules(candidate, campaign.responsible_rules or [], departments)), None)
        manager = manager or next((candidate for candidate in candidates if candidate.id != user.id and candidate.role in {"developer", "admin"}), None)
    if manager:
        recipients.append(manager)
    message = f"{'Просрочено' if row.status == 'overdue' else 'Напоминание'}: нужно ознакомиться с документом «{document.title}» до {row.due_at.strftime('%d.%m.%Y') if row.due_at else 'указанного срока'}."
    failures: list[dict[str, str]] = []
    for recipient in recipients:
        try:
            bitrix_call(identity, "im.notify.personal.add", {"to": int(recipient.bitrix_user_id), "message": message})
            _event(session, row.campaign_id, "escalation_sent" if recipient is manager else "reminder_sent", assignment=row,
                   actor_id=identity.user.id, details={"recipient": recipient.bitrix_user_id, "automatic": automatic})
        except Exception as exc:
            failures.append({"recipient": recipient.bitrix_user_id, "message": str(getattr(exc, "detail", exc))})
            _event(session, row.campaign_id, "notification_failed", assignment=row, actor_id=identity.user.id, details=failures[-1])
    return {"employee": user.bitrix_user_id, "manager": manager.bitrix_user_id if manager else "", "failures": failures}


def _reconcile_new_hires(session: Session) -> None:
    now = utcnow()
    campaigns = session.exec(select(AcknowledgementCampaign).where(
        AcknowledgementCampaign.status == "active", AcknowledgementCampaign.include_new_hires == True)).all()  # noqa: E712
    changed = False
    for campaign in campaigns:
        existing = {row.user_id for row in session.exec(select(AcknowledgementAssignment).where(AcknowledgementAssignment.campaign_id == campaign.id)).all()}
        for user in _recipient_users(session, campaign.recipient_rules):
            if user.id in existing:
                continue
            _add_assignment(session, campaign, user, event_type="new_hire_assigned")
            changed = True
    if changed:
        session.commit()


def _mark_overdue(session: Session, identity: BitrixIdentity | None = None) -> None:
    now = utcnow()
    rows = session.exec(select(AcknowledgementAssignment).where(
        AcknowledgementAssignment.status.in_(["not_started", "in_progress"]), AcknowledgementAssignment.due_at < now)).all()
    changed = False
    for row in rows:
        row.status = "overdue"; row.updated_at = now; session.add(row)
        _event(session, row.campaign_id, "overdue", assignment=row); changed = True
        if identity:
            try:
                _send_reminder(session, identity, row, automatic=True)
            except HTTPException:
                pass
    if changed:
        session.commit()


def _assignment_payload(
    session: Session,
    row: AcknowledgementAssignment,
    departments: dict[str, BitrixDepartment] | None = None,
    active_users: list[AppUser] | None = None,
) -> dict[str, Any]:
    campaign = session.get(AcknowledgementCampaign, row.campaign_id)
    edition = session.get(KnowledgeEdition, campaign.edition_id) if campaign else None
    document = session.get(KnowledgeDocument, edition.document_id) if edition else None
    user = session.get(AppUser, row.user_id)
    departments = departments if departments is not None else _department_map(session)
    active_users = active_users if active_users is not None else session.exec(
        select(AppUser).where(AppUser.active == True)  # noqa: E712
    ).all()
    responsibles = [candidate for candidate in active_users
                    if campaign and _match_rules(candidate, campaign.responsible_rules or [], departments)]
    public_test = None
    if campaign and campaign.mode == "test" and document:
        source = document.light_test if campaign.test_kind == "light" else document.full_test
        public_test = {
            "title": source.get("title") or document.title,
            "questions": [
                {
                    "id": str(question.get("id") or f"q_{index}"),
                    "type": str(question.get("type") or "single"),
                    "text": str(question.get("text") or ""),
                    "answers": list(question.get("answers") or []),
                    "pairsLeft": [str(pair.get("left") or "") for pair in question.get("pairs") or []],
                    "pairOptions": sorted(str(pair.get("right") or "") for pair in question.get("pairs") or []),
                }
                for index, question in enumerate(source.get("questions") or [])
            ],
        }
    return {"id": row.id, "campaignId": row.campaign_id, "userId": row.user_id, "userBitrixId": user.bitrix_user_id if user else "",
            "userName": _name(user), "userPhoto": user.photo_url if user else "", "status": row.status, "answer": row.answer, "assignedAt": _iso(row.assigned_at), "dueAt": _iso(row.due_at),
            "startedAt": _iso(row.started_at), "completedAt": _iso(row.completed_at), "reviewedAt": _iso(row.reviewed_at),
            "reviewComment": row.review_comment, "manualReason": row.manual_reason, "campaign": _campaign(campaign) if campaign else None,
            "edition": _edition(edition) if edition else None,
            "document": {"id": document.id, "title": document.title, "description": document.description, "documentUrl": document.document_url} if document else None,
            "responsibles": [{"id": candidate.id, "bitrixId": candidate.bitrix_user_id, "name": _name(candidate), "photo": candidate.photo_url} for candidate in responsibles],
            "test": public_test}


def _grade_linked_test(test: dict[str, Any], submitted: Any) -> tuple[bool, int]:
    questions = list(test.get("questions") or [])
    if not questions or not isinstance(submitted, dict):
        raise HTTPException(422, "Submit answers for every test question")
    answers = submitted.get("answers")
    if not isinstance(answers, dict):
        raise HTTPException(422, "Test answers must be an object")
    correct_count = 0
    for index, question in enumerate(questions):
        question_id = str(question.get("id") or f"q_{index}")
        actual = answers.get(question_id)
        if str(question.get("type") or "single") == "match":
            expected = [str(pair.get("right") or "") for pair in question.get("pairs") or []]
            values = [str(value) for value in actual] if isinstance(actual, list) else []
            correct = bool(expected) and values == expected
        else:
            expected = sorted(int(value) for value in question.get("correct") or [])
            try:
                values = sorted(int(value) for value in (actual if isinstance(actual, list) else [actual]))
            except (TypeError, ValueError):
                values = []
            correct = bool(expected) and values == expected
        if correct:
            correct_count += 1
    score = round(correct_count * 100 / len(questions))
    pass_score = max(0, min(100, int(test.get("passScore") or 100)))
    return score >= pass_score, score


@router.get("/documents/{document_id}/editions")
def list_editions(document_id: int, session: Annotated[Session, Depends(get_session)], identity: Annotated[BitrixIdentity, Depends(require_bitrix_identity)]):
    document = session.get(KnowledgeDocument, document_id)
    if not document or not document.active:
        raise HTTPException(404, "Документ не найден")
    rows = session.exec(select(KnowledgeEdition).where(KnowledgeEdition.document_id == document_id).order_by(KnowledgeEdition.edition_date.desc())).all()
    campaigns = session.exec(select(AcknowledgementCampaign).where(AcknowledgementCampaign.edition_id.in_([row.id for row in rows] or [-1]))).all()
    by_edition = {row.edition_id: _campaign(row) for row in campaigns}
    return [{**_edition(row), "campaign": by_edition.get(row.id)} for row in rows]


@router.post("/documents/{document_id}/editions")
def save_edition(document_id: int, payload: EditionWrite, session: Annotated[Session, Depends(get_session)], identity: Annotated[BitrixIdentity, Depends(require_editor)]):
    if not session.get(KnowledgeDocument, document_id):
        raise HTTPException(404, "Документ не найден")
    row = session.exec(select(KnowledgeEdition).where(KnowledgeEdition.document_id == document_id, KnowledgeEdition.edition_date == payload.editionDate)).first()
    if row is not None:
        campaign = session.exec(select(AcknowledgementCampaign).where(AcknowledgementCampaign.edition_id == row.id)).first()
        if campaign and campaign.status != "draft":
            raise HTTPException(409, "На эту дату уже есть запущенная редакция. Выберите другую дату для новой редакции")
    if row is None:
        row = KnowledgeEdition(document_id=document_id, edition_date=payload.editionDate, created_by=identity.user.id)
    row.google_revision_id = payload.googleRevisionId.strip(); row.google_version_name = payload.googleVersionName.strip()
    row.change_log = payload.changeLog.strip(); row.updated_at = utcnow(); session.add(row); session.commit(); session.refresh(row)
    return _edition(row)


@router.delete("/editions/{edition_id}", status_code=204)
def delete_edition(
    edition_id: int,
    payload: EditionDeleteWrite,
    session: Annotated[Session, Depends(get_session)],
    identity: Annotated[BitrixIdentity, Depends(require_developer)],
):
    """Delete a diagnostic edition and its acknowledgement data as one transaction."""
    edition = session.get(KnowledgeEdition, edition_id)
    if not edition:
        raise HTTPException(404, "Редакция не найдена")
    if payload.confirmationDate != edition.edition_date:
        raise HTTPException(422, "Дата подтверждения не совпадает с датой редакции")

    campaign = session.exec(
        select(AcknowledgementCampaign).where(AcknowledgementCampaign.edition_id == edition.id)
    ).first()
    try:
        if campaign:
            assignments = session.exec(
                select(AcknowledgementAssignment).where(AcknowledgementAssignment.campaign_id == campaign.id)
            ).all()
            assignment_ids = [row.id for row in assignments]
            events = session.exec(
                select(AcknowledgementEvent).where(
                    (AcknowledgementEvent.campaign_id == campaign.id)
                    | (AcknowledgementEvent.assignment_id.in_(assignment_ids or [-1]))
                )
            ).all()
            for row in events:
                session.delete(row)
            for row in assignments:
                session.delete(row)
            session.delete(campaign)
        session.delete(edition)
        session.commit()
    except Exception:
        session.rollback()
        logger.exception("Failed to delete acknowledgement edition", extra={"edition_id": edition_id})
        raise HTTPException(500, "Не удалось удалить редакцию. Данные не изменены")


@router.post("/editions/{edition_id}/campaign")
def save_campaign(edition_id: int, payload: CampaignWrite, session: Annotated[Session, Depends(get_session)], identity: Annotated[BitrixIdentity, Depends(require_editor)]):
    edition = session.get(KnowledgeEdition, edition_id)
    if not edition: raise HTTPException(404, "Редакция не найдена")
    document = session.get(KnowledgeDocument, edition.document_id)
    _validate_campaign(payload, document)
    row = session.exec(select(AcknowledgementCampaign).where(AcknowledgementCampaign.edition_id == edition_id)).first()
    if row and row.status != "draft": raise HTTPException(409, "Запущенную кампанию нельзя переписать; измените срок или создайте следующую редакцию")
    if row is None: row = AcknowledgementCampaign(edition_id=edition_id, created_by=identity.user.id)
    row.mode=payload.mode; row.question=payload.question; row.test_kind=payload.testKind; row.recipient_rules=payload.recipientRules
    row.responsible_rules=payload.responsibleRules; row.due_days=payload.dueDays; row.include_new_hires=payload.includeNewHires
    row.notification_settings=payload.notificationSettings; row.updated_at=utcnow(); session.add(row); session.commit(); session.refresh(row)
    return _campaign(row)


@router.post("/campaigns/{campaign_id}/launch")
def launch_campaign(campaign_id: int, session: Annotated[Session, Depends(get_session)], identity: Annotated[BitrixIdentity, Depends(require_editor)]):
    campaign = session.get(AcknowledgementCampaign, campaign_id)
    if not campaign: raise HTTPException(404, "Кампания не найдена")
    if campaign.status != "draft": raise HTTPException(409, "Кампания уже запущена")
    users = _recipient_users(session, campaign.recipient_rules)
    if not users: raise HTTPException(422, "По выбранным правилам не найдено ни одного активного сотрудника")
    now = utcnow()
    campaign.status="active"; campaign.launched_at=now; campaign.updated_at=now; session.add(campaign)
    edition=session.get(KnowledgeEdition,campaign.edition_id); document=session.get(KnowledgeDocument,edition.document_id)
    notification_errors=[]
    for user in users:
        assignment = _add_assignment(session, campaign, user, actor_id=identity.user.id)
        failure = _deliver_assignment(session, identity, campaign, assignment, user, document, edition)
        if failure:
            notification_errors.append(failure)
    session.commit()
    return {"campaign":_campaign(campaign),"assigned":len(users),"notificationErrors":notification_errors}


@router.get("/campaigns/{campaign_id}")
def campaign_details(campaign_id: int, session: Annotated[Session, Depends(get_session)], identity: Annotated[BitrixIdentity, Depends(require_editor)]):
    campaign = session.get(AcknowledgementCampaign, campaign_id)
    if not campaign:
        raise HTTPException(404, "Кампания не найдена")
    rows = session.exec(select(AcknowledgementAssignment).where(
        AcknowledgementAssignment.campaign_id == campaign_id).order_by(AcknowledgementAssignment.assigned_at)).all()
    return {"campaign": _campaign(campaign), "assignments": [_assignment_payload(session, row) for row in rows]}


@router.put("/campaigns/{campaign_id}")
def update_active_campaign(
    campaign_id: int,
    payload: ActiveCampaignWrite,
    session: Annotated[Session, Depends(get_session)],
    identity: Annotated[BitrixIdentity, Depends(require_editor)],
):
    campaign = session.get(AcknowledgementCampaign, campaign_id)
    if not campaign:
        raise HTTPException(404, "Кампания не найдена")
    if campaign.status != "active":
        raise HTTPException(409, "Редактировать можно только активную кампанию")
    if not payload.recipientRules:
        raise HTTPException(422, "Выберите хотя бы одного получателя")
    if not payload.responsibleRules:
        raise HTTPException(422, "Выберите хотя бы одного ответственного")
    if payload.dueDatePolicy not in {"new_only", "recalculate"}:
        raise HTTPException(422, "Неизвестное правило пересчёта срока")

    old_due_days = campaign.due_days
    campaign.recipient_rules = payload.recipientRules
    campaign.responsible_rules = payload.responsibleRules
    campaign.due_days = payload.dueDays
    campaign.include_new_hires = payload.includeNewHires
    campaign.updated_at = utcnow()
    session.add(campaign)

    rows = session.exec(select(AcknowledgementAssignment).where(
        AcknowledgementAssignment.campaign_id == campaign_id)).all()
    existing = {row.user_id for row in rows}
    edition = session.get(KnowledgeEdition, campaign.edition_id)
    document = session.get(KnowledgeDocument, edition.document_id) if edition else None
    notification_errors: list[dict[str, Any]] = []
    added = 0
    for user in _recipient_users(session, payload.recipientRules):
        if user.id in existing:
            continue
        assignment = _add_assignment(session, campaign, user, actor_id=identity.user.id, event_type="recipient_added")
        added += 1
        if document and edition:
            failure = _deliver_assignment(session, identity, campaign, assignment, user, document, edition)
            if failure:
                notification_errors.append(failure)

    recalculated = 0
    if payload.dueDatePolicy == "recalculate" and old_due_days != payload.dueDays:
        for row in rows:
            if row.status in {"completed", "exempted"}:
                continue
            row.due_at = _due_at(row.assigned_at, payload.dueDays)
            row.updated_at = utcnow()
            session.add(row)
            _event(session, campaign.id, "deadline_recalculated", assignment=row, actor_id=identity.user.id,
                   details={"oldDueDays": old_due_days, "newDueDays": payload.dueDays})
            recalculated += 1

    _event(session, campaign.id, "campaign_updated", actor_id=identity.user.id,
           details={"added": added, "recalculated": recalculated, "dueDatePolicy": payload.dueDatePolicy})
    session.commit()
    session.refresh(campaign)
    return {"campaign": _campaign(campaign), "added": added, "recalculated": recalculated,
            "notificationErrors": notification_errors}


@router.post("/assignments/{assignment_id}/exempt")
def exempt_assignment(
    assignment_id: int,
    payload: ExemptWrite,
    session: Annotated[Session, Depends(get_session)],
    identity: Annotated[BitrixIdentity, Depends(require_editor)],
):
    row = session.get(AcknowledgementAssignment, assignment_id)
    campaign = session.get(AcknowledgementCampaign, row.campaign_id) if row else None
    if not row or not campaign:
        raise HTTPException(404, "Назначение не найдено")
    if campaign.status != "active":
        raise HTTPException(409, "Назначения можно снимать только в активной кампании")
    if row.status == "completed":
        raise HTTPException(409, "Завершённое назначение снять нельзя")
    if row.status == "exempted":
        raise HTTPException(409, "Назначение уже снято")
    row.status = "exempted"
    row.manual_reason = payload.reason.strip()
    row.reviewed_by = identity.user.id
    row.reviewed_at = utcnow()
    row.updated_at = row.reviewed_at
    session.add(row)
    _event(session, campaign.id, "assignment_exempted", assignment=row, actor_id=identity.user.id,
           details={"reason": row.manual_reason})
    _maybe_close_campaign(session, campaign.id)
    session.commit()
    return _assignment_payload(session, row)


@router.post("/campaigns/{campaign_id}/close")
def close_campaign(
    campaign_id: int,
    payload: CloseCampaignWrite,
    session: Annotated[Session, Depends(get_session)],
    identity: Annotated[BitrixIdentity, Depends(require_editor)],
):
    campaign = session.get(AcknowledgementCampaign, campaign_id)
    if not campaign:
        raise HTTPException(404, "Кампания не найдена")
    if campaign.status != "active":
        raise HTTPException(409, "Завершить досрочно можно только активную кампанию")
    now = utcnow()
    rows = session.exec(select(AcknowledgementAssignment).where(
        AcknowledgementAssignment.campaign_id == campaign_id)).all()
    exempted = 0
    for row in rows:
        if row.status in {"completed", "exempted"}:
            continue
        row.status = "exempted"
        row.manual_reason = payload.reason.strip()
        row.reviewed_by = identity.user.id
        row.reviewed_at = now
        row.updated_at = now
        session.add(row)
        _event(session, campaign.id, "assignment_exempted", assignment=row, actor_id=identity.user.id,
               details={"reason": row.manual_reason, "campaignClose": True})
        exempted += 1
    campaign.status = "closed"
    campaign.closed_at = now
    campaign.updated_at = now
    session.add(campaign)
    _event(session, campaign.id, "campaign_closed", actor_id=identity.user.id,
           details={"automatic": False, "reason": payload.reason.strip(), "exempted": exempted})
    session.commit()
    return {"campaign": _campaign(campaign), "exempted": exempted}


@router.get("/assignments/mine")
def my_assignments(session: Annotated[Session, Depends(get_session)], identity: Annotated[BitrixIdentity, Depends(require_bitrix_identity)]):
    _reconcile_new_hires(session); _mark_overdue(session, identity)
    rows=session.exec(select(AcknowledgementAssignment).where(AcknowledgementAssignment.user_id==identity.user.id).order_by(AcknowledgementAssignment.assigned_at.desc())).all()
    return [_assignment_payload(session,row) for row in rows]


@router.post("/assignments/{assignment_id}/start")
def start_assignment(assignment_id:int,session:Annotated[Session,Depends(get_session)],identity:Annotated[BitrixIdentity,Depends(require_bitrix_identity)]):
    row=session.get(AcknowledgementAssignment,assignment_id)
    if not row or row.user_id!=identity.user.id: raise HTTPException(404,"Назначение не найдено")
    if row.status == "exempted": raise HTTPException(409,"Это назначение снято")
    if row.status in {"not_started","overdue","returned"}: row.status="in_progress"; row.started_at=row.started_at or utcnow(); row.updated_at=utcnow(); session.add(row); _event(session,row.campaign_id,"started",assignment=row,actor_id=identity.user.id); session.commit()
    return _assignment_payload(session,row)


@router.post("/assignments/{assignment_id}/answer")
def answer_assignment(assignment_id:int,payload:AnswerWrite,session:Annotated[Session,Depends(get_session)],identity:Annotated[BitrixIdentity,Depends(require_bitrix_identity)]):
    row=session.get(AcknowledgementAssignment,assignment_id)
    if not row or row.user_id!=identity.user.id: raise HTTPException(404,"Назначение не найдено")
    if row.status == "exempted": raise HTTPException(409,"Это назначение снято")
    campaign=session.get(AcknowledgementCampaign,row.campaign_id); now=utcnow(); answer=payload.answer
    if campaign.mode=="confirm": passed=True
    elif campaign.mode=="question":
        kind=str((campaign.question or {}).get("type") or "single")
        if kind=="free":
            if not str(answer or "").strip(): raise HTTPException(422,"Введите ответ")
            row.status="pending_review"; row.answer={"value":answer}; row.started_at=row.started_at or now; row.updated_at=now; session.add(row); _event(session,row.campaign_id,"answer_submitted",assignment=row,actor_id=identity.user.id); session.commit(); return _assignment_payload(session,row)
        expected={str(value) for value in (campaign.question.get("correct") or [])}; actual={str(value) for value in (answer if isinstance(answer,list) else [answer])}; passed=actual==expected
    else:
        edition = session.get(KnowledgeEdition, campaign.edition_id)
        document = session.get(KnowledgeDocument, edition.document_id) if edition else None
        if not document:
            raise HTTPException(409, "Linked test document is unavailable")
        test = document.light_test if campaign.test_kind == "light" else document.full_test
        passed, score = _grade_linked_test(test, answer)
        answer = {"answers": answer.get("answers", {}), "score": score}
    row.answer={"value":answer,"passed":passed}; row.started_at=row.started_at or now
    row.status="completed" if passed else "returned"; row.completed_at=now if passed else None; row.updated_at=now; session.add(row)
    _event(session,row.campaign_id,"completed" if passed else "answer_rejected",assignment=row,actor_id=identity.user.id)
    if passed: _maybe_close_campaign(session, row.campaign_id)
    session.commit()
    return _assignment_payload(session,row)


@router.post("/assignments/{assignment_id}/review")
def review_assignment(assignment_id:int,payload:ReviewWrite,session:Annotated[Session,Depends(get_session)],identity:Annotated[BitrixIdentity,Depends(require_bitrix_identity)]):
    row=session.get(AcknowledgementAssignment,assignment_id); campaign=session.get(AcknowledgementCampaign,row.campaign_id) if row else None
    if not row or not campaign: raise HTTPException(404,"Назначение не найдено")
    if not _can_manage(identity,campaign,_department_map(session)): raise HTTPException(403,"Нет права проверять этот ответ")
    now=utcnow(); row.status="completed" if payload.accepted else "returned"; row.completed_at=now if payload.accepted else None
    row.reviewed_by=identity.user.id; row.reviewed_at=now; row.review_comment=payload.comment.strip(); row.updated_at=now; session.add(row)
    _event(session,row.campaign_id,"review_accepted" if payload.accepted else "review_returned",assignment=row,actor_id=identity.user.id,details={"comment":row.review_comment})
    if payload.accepted: _maybe_close_campaign(session, row.campaign_id)
    session.commit()
    return _assignment_payload(session,row)


@router.post("/assignments/{assignment_id}/manual-complete")
def manual_complete(assignment_id:int,payload:ManualCompleteWrite,session:Annotated[Session,Depends(get_session)],identity:Annotated[BitrixIdentity,Depends(require_bitrix_identity)]):
    row=session.get(AcknowledgementAssignment,assignment_id); campaign=session.get(AcknowledgementCampaign,row.campaign_id) if row else None
    if not row or not campaign: raise HTTPException(404,"Назначение не найдено")
    own=row.user_id==identity.user.id and identity.user.role=="editor"
    if not own and not _can_manage(identity,campaign,_department_map(session)): raise HTTPException(403,"Можно отметить только своё или назначенное вам ознакомление")
    now=utcnow(); row.status="completed"; row.completed_at=now; row.reviewed_by=identity.user.id; row.reviewed_at=now; row.manual_reason=payload.reason; row.updated_at=now; session.add(row)
    _event(session,row.campaign_id,"manual_complete",assignment=row,actor_id=identity.user.id,details={"reason":payload.reason})
    _maybe_close_campaign(session, row.campaign_id)
    session.commit(); return _assignment_payload(session,row)


@router.get("/center")
def center(session:Annotated[Session,Depends(get_session)],identity:Annotated[BitrixIdentity,Depends(require_bitrix_identity)],scope:str=Query("all"),history:bool=False):
    if identity.user.role not in MANAGER_ROLES: raise HTTPException(403,"Центр проверок доступен преподавателю и выше")
    _reconcile_new_hires(session); _mark_overdue(session, identity); rows=session.exec(select(AcknowledgementAssignment).order_by(AcknowledgementAssignment.assigned_at.desc())).all()
    departments = _department_map(session)
    active_users = session.exec(select(AppUser).where(AppUser.active == True)).all()  # noqa: E712
    payload=[_assignment_payload(session,row,departments,active_users) for row in rows]
    if not history: payload=[row for row in payload if row["status"] not in {"completed","exempted"}]
    if scope=="mine":
        payload=[row for row in payload if _can_manage(identity,session.get(AcknowledgementCampaign,row["campaignId"]),departments)]
    elif scope=="overdue": payload=[row for row in payload if row["status"]=="overdue"]
    elif scope=="idle3": payload=[row for row in payload if row["status"]=="not_started" and datetime.fromisoformat(row["assignedAt"]) < utcnow()-timedelta(days=3)]
    return payload


@router.get("/users/{user_id}/acknowledgements")
def user_history(user_id:int,session:Annotated[Session,Depends(get_session)],identity:Annotated[BitrixIdentity,Depends(require_bitrix_identity)]):
    target=session.get(AppUser,user_id) or session.exec(select(AppUser).where(AppUser.bitrix_user_id==str(user_id))).first()
    if not target: raise HTTPException(404,"Сотрудник не найден")
    if identity.user.role not in MANAGER_ROLES and identity.user.id!=target.id: raise HTTPException(403,"Нет доступа к карточке сотрудника")
    rows=session.exec(select(AcknowledgementAssignment).where(AcknowledgementAssignment.user_id==target.id).order_by(AcknowledgementAssignment.assigned_at.desc())).all()
    return [_assignment_payload(session,row) for row in rows]


@router.post("/assignments/{assignment_id}/remind")
def remind_assignment(assignment_id:int,session:Annotated[Session,Depends(get_session)],identity:Annotated[BitrixIdentity,Depends(require_bitrix_identity)]):
    row=session.get(AcknowledgementAssignment,assignment_id); campaign=session.get(AcknowledgementCampaign,row.campaign_id) if row else None
    if not row or not campaign: raise HTTPException(404,"Назначение не найдено")
    if not _can_manage(identity,campaign,_department_map(session)): raise HTTPException(403,"Нет права отправлять напоминание")
    result=_send_reminder(session,identity,row); session.commit(); return result


def _fernet() -> Fernet:
    key=get_settings().google_token_encryption_key.strip()
    if not key: raise HTTPException(503,"На сервере не настроено шифрование токенов Google")
    try: return Fernet(key.encode())
    except ValueError as exc: raise HTTPException(503,"Ключ шифрования Google имеет неверный формат") from exc


def _decrypt(value:str)->str:
    try: return _fernet().decrypt(value.encode()).decode()
    except InvalidToken as exc: raise HTTPException(503,"Не удалось расшифровать токен Google; подключите аккаунт заново") from exc


@router.get("/google/status")
def google_status(session:Annotated[Session,Depends(get_session)],_:Annotated[BitrixIdentity,Depends(require_editor)]):
    settings=get_settings(); credential=session.exec(select(GoogleOAuthCredential).order_by(GoogleOAuthCredential.id.desc())).first()
    return {"configured":bool(settings.google_client_id and settings.google_client_secret and settings.google_token_encryption_key),"connected":bool(credential and credential.encrypted_refresh_token),"accountEmail":credential.account_email if credential else "","scope":GOOGLE_SCOPE}


@router.post("/google/oauth/start")
def google_oauth_start(session:Annotated[Session,Depends(get_session)],identity:Annotated[BitrixIdentity,Depends(require_editor)]):
    settings=get_settings()
    if not settings.google_client_id or not settings.google_client_secret: raise HTTPException(503,"Добавьте Google OAuth Client ID и Client secret в настройки сервера")
    state=secrets.token_urlsafe(40); session.add(GoogleOAuthState(state=state,user_id=identity.user.id,expires_at=utcnow()+timedelta(minutes=10))); session.commit()
    redirect=f"{settings.public_origin.rstrip('/')}/api/v51/google/oauth/callback"
    params={"client_id":settings.google_client_id,"redirect_uri":redirect,"response_type":"code","scope":GOOGLE_SCOPE,"access_type":"offline","include_granted_scopes":"true","prompt":"consent","state":state}
    return {"authorizationUrl":"https://accounts.google.com/o/oauth2/v2/auth?"+urlencode(params)}


@router.get("/google/oauth/callback",response_class=HTMLResponse)
def google_oauth_callback(state:str,code:str="",error:str="",session:Session=Depends(get_session)):
    pending=session.exec(select(GoogleOAuthState).where(GoogleOAuthState.state==state)).first()
    if not pending or pending.expires_at<utcnow(): raise HTTPException(400,"Запрос Google OAuth устарел или не найден")
    pending_user_id=pending.user_id; session.delete(pending); session.commit()
    if error or not code: return HTMLResponse("<h2>Google Drive не подключён</h2><p>Доступ не был предоставлен. Окно можно закрыть.</p>",status_code=400)
    settings=get_settings(); redirect=f"{settings.public_origin.rstrip('/')}/api/v51/google/oauth/callback"
    response=httpx.post("https://oauth2.googleapis.com/token",data={"client_id":settings.google_client_id,"client_secret":settings.google_client_secret,"code":code,"grant_type":"authorization_code","redirect_uri":redirect},timeout=20)
    if response.is_error: raise HTTPException(502,"Google не выдал токен доступа")
    data=response.json(); fernet=_fernet(); existing=session.exec(select(GoogleOAuthCredential).order_by(GoogleOAuthCredential.id.desc())).first()
    row=existing or GoogleOAuthCredential(connected_by=pending_user_id)
    refresh=data.get("refresh_token") or (_decrypt(row.encrypted_refresh_token) if row.encrypted_refresh_token else "")
    if not refresh: raise HTTPException(502,"Google не выдал refresh token; отзовите доступ и подключите аккаунт заново")
    row.encrypted_refresh_token=fernet.encrypt(refresh.encode()).decode(); row.encrypted_access_token=fernet.encrypt(str(data.get("access_token") or "").encode()).decode()
    row.access_expires_at=utcnow()+timedelta(seconds=int(data.get("expires_in") or 3600)); row.scopes=str(data.get("scope") or GOOGLE_SCOPE).split(); row.updated_at=utcnow(); session.add(row); session.commit()
    return HTMLResponse("<script>if(window.opener){window.opener.postMessage({type:'rtm-google-connected'},location.origin);setTimeout(()=>window.close(),300)}</script><h2>Google Drive подключён</h2><p>Окно закроется автоматически.</p>")


def _google_access_token(session:Session)->str:
    row=session.exec(select(GoogleOAuthCredential).order_by(GoogleOAuthCredential.id.desc())).first()
    if not row or not row.encrypted_refresh_token: raise HTTPException(409,"Сначала подключите Google Drive")
    if row.encrypted_access_token and row.access_expires_at and row.access_expires_at>utcnow()+timedelta(minutes=2): return _decrypt(row.encrypted_access_token)
    settings=get_settings(); response=httpx.post("https://oauth2.googleapis.com/token",data={"client_id":settings.google_client_id,"client_secret":settings.google_client_secret,"refresh_token":_decrypt(row.encrypted_refresh_token),"grant_type":"refresh_token"},timeout=20)
    if response.is_error: raise HTTPException(502,"Не удалось обновить доступ к Google Drive")
    data=response.json(); row.encrypted_access_token=_fernet().encrypt(str(data["access_token"]).encode()).decode(); row.access_expires_at=utcnow()+timedelta(seconds=int(data.get("expires_in") or 3600)); row.updated_at=utcnow(); session.add(row); session.commit(); return str(data["access_token"])


def _google_file_id(url:str)->str:
    match=re.search(r"/d/([a-zA-Z0-9_-]+)",url or "") or re.search(r"[?&]id=([a-zA-Z0-9_-]+)",url or "")
    if not match: raise HTTPException(422,"Не удалось определить ID Google-документа по ссылке")
    return match.group(1)


def _google_document_snapshot(token: str, file_id: str) -> tuple[dict[str, Any], str, datetime | None, list[dict[str, Any]]]:
    headers = {"Authorization": f"Bearer {token}"}
    metadata = httpx.get(f"https://www.googleapis.com/drive/v3/files/{file_id}", params={"fields": "id,mimeType,headRevisionId,modifiedTime"}, headers=headers, timeout=20)
    if metadata.status_code in {401, 403}:
        raise HTTPException(403, "Google-аккаунт не имеет доступа к документу или не выданы права чтения Docs/Drive")
    if metadata.is_error:
        raise HTTPException(502, "Google Drive не вернул сведения о документе")
    meta = metadata.json()
    if meta.get("mimeType") != "application/vnd.google-apps.document":
        raise HTTPException(422, "Рендер документа поддерживает только Google Docs")
    response = httpx.get(f"https://docs.googleapis.com/v1/documents/{file_id}", headers=headers, timeout=30)
    if response.status_code in {401, 403}:
        raise HTTPException(403, "Google-аккаунт не имеет права читать содержимое документа")
    if response.is_error:
        raise HTTPException(502, "Google Docs не вернул содержимое документа")
    comments_response = httpx.get(f"https://www.googleapis.com/drive/v3/files/{file_id}/comments", params={"pageSize": 100, "fields": "comments(id,content,quotedFileContent,author,createdTime,resolved,deleted,replies(id,content,author,createdTime,deleted))"}, headers=headers, timeout=20)
    comments = [] if comments_response.is_error else list(comments_response.json().get("comments") or [])
    try:
        modified_at = datetime.fromisoformat(str(meta.get("modifiedTime") or "").replace("Z", "+00:00")) or None
    except ValueError:
        modified_at = None
    return response.json(), str(meta.get("headRevisionId") or ""), modified_at, comments


def _render_summary(row: KnowledgeDocumentRender | None) -> dict[str, Any]:
    if row is None:
        return {"available": False, "status": "not_rendered", "lastError": "", "renderedAt": None}
    return {"available": bool(row.payload) and row.status == "published", "status": row.status, "lastError": row.last_error, "renderedAt": _iso(row.rendered_at), "sourceRevisionId": row.source_revision_id}


def _render_asset_dir() -> Path:
    path = Path(get_settings().document_render_media_dir).resolve()
    path.mkdir(parents=True, exist_ok=True)
    return path


def _render_revision_key(revision_id: str) -> str:
    return hashlib.sha256(revision_id.encode()).hexdigest()[:16]


def _store_google_image(document_id: int, revision_id: str, token: str, source_uri: str) -> str:
    host = (urlparse(source_uri).hostname or "").lower()
    if host != "docs.google.com" and not host.endswith(".googleusercontent.com"):
        raise HTTPException(502, "Google Docs вернул неподдерживаемый адрес изображения")
    response = httpx.get(source_uri, headers={"Authorization": f"Bearer {token}"}, timeout=30)
    content_type = response.headers.get("content-type", "").split(";", 1)[0].lower()
    if response.is_error or not content_type.startswith("image/"):
        raise HTTPException(502, "Не удалось получить изображение из Google Docs")
    if len(response.content) > 15 * 1024 * 1024:
        raise HTTPException(422, "Изображение в Google Docs превышает допустимый размер 15 МБ")
    extension = mimetypes.guess_extension(content_type) or ".bin"
    asset_name = hashlib.sha256(response.content).hexdigest() + extension
    revision_key = _render_revision_key(revision_id)
    target = _render_asset_dir() / str(document_id) / f"revision-{revision_key}" / "assets" / asset_name
    target.parent.mkdir(parents=True, exist_ok=True)
    if not target.exists(): target.write_bytes(response.content)
    return f"/api/v51/documents/{document_id}/document-render/assets/{revision_key}/{asset_name}"


@router.post("/documents/{document_id}/document-render/refresh")
def refresh_document_render(document_id: int, session: Annotated[Session, Depends(get_session)], _: Annotated[BitrixIdentity, Depends(require_editor)]):
    document = session.get(KnowledgeDocument, document_id)
    if not document: raise HTTPException(404, "Документ не найден")
    if document.source_row != 540: raise HTTPException(409, "В пилоте доступен только рендер документа «Базовое обучение как работать с строительными лесами»")
    row = session.exec(select(KnowledgeDocumentRender).where(KnowledgeDocumentRender.document_id == document.id)).first()
    if row is None:
        row = KnowledgeDocumentRender(document_id=document.id)
    row.status = "rendering"; row.last_error = ""; row.updated_at = utcnow(); session.add(row); session.commit()
    try:
        source, revision_id, modified_at, comments = _google_document_snapshot(_google_access_token(session), _google_file_id(document.document_url))
        payload, _ = compose(source, comments)
        payload = materialize_images(payload, lambda source_uri: _store_google_image(document.id, revision_id, _google_access_token(session), source_uri))
        if row.payload and row.content_hash == payload["contentHash"]:
            row.status = "published"; row.source_revision_id = revision_id; row.source_modified_at = modified_at; row.rendered_at = utcnow(); row.updated_at = utcnow(); session.add(row); session.commit()
            return {"changed": False, "render": _render_summary(row)}
        row.status = "published"; row.source_revision_id = revision_id; row.source_modified_at = modified_at; row.content_hash = payload["contentHash"]; row.payload = payload; row.rendered_at = utcnow(); row.updated_at = utcnow(); session.add(row); session.commit()
        return {"changed": True, "render": _render_summary(row)}
    except HTTPException as error:
        row.status = "published" if row.payload else "error"; row.last_error = str(error.detail); row.updated_at = utcnow(); session.add(row); session.commit(); raise


@router.get("/documents/{document_id}/document-render/status")
def document_render_status(document_id: int, session: Annotated[Session, Depends(get_session)], _: Annotated[BitrixIdentity, Depends(require_editor)]):
    document = session.get(KnowledgeDocument, document_id)
    if not document: raise HTTPException(404, "Документ не найден")
    row = session.exec(select(KnowledgeDocumentRender).where(KnowledgeDocumentRender.document_id == document.id)).first()
    return _render_summary(row)


@router.get("/documents/{document_id}/document-render")
def get_document_render(document_id: int, session: Annotated[Session, Depends(get_session)], identity: Annotated[BitrixIdentity, Depends(require_bitrix_identity)]):
    document = session.get(KnowledgeDocument, document_id)
    if not document or not document.active: raise HTTPException(404, "Документ не найден")
    departments = {item.bitrix_department_id: item for item in session.exec(select(BitrixDepartment).where(BitrixDepartment.active == True)).all()}
    if not _allows(document.article_assignments, identity, departments): raise HTTPException(403, "Документ не назначен пользователю")
    row = session.exec(select(KnowledgeDocumentRender).where(KnowledgeDocumentRender.document_id == document.id)).first()
    if not row or not row.payload or row.status != "published": raise HTTPException(404, "Рендер документа пока не опубликован")
    return {"documentId": document.id, "title": document.title, "render": row.payload, "status": _render_summary(row)}


@router.get("/documents/{document_id}/document-render/assets/{revision_key}/{asset_name}")
def get_document_render_asset(document_id: int, revision_key: str, asset_name: str):
    if not re.fullmatch(r"[a-f0-9]{64}\.[a-z0-9]+", asset_name): raise HTTPException(404, "Ассет не найден")
    if not re.fullmatch(r"[a-f0-9]{16}", revision_key): raise HTTPException(404, "Ассет не найден")
    target = _render_asset_dir() / str(document_id) / f"revision-{revision_key}" / "assets" / asset_name
    if not target.is_file(): raise HTTPException(404, "Ассет не найден")
    return FileResponse(target, media_type=mimetypes.guess_type(target.name)[0] or "application/octet-stream", headers={"Cache-Control": "public, max-age=31536000, immutable"})


@router.get("/documents/{document_id}/google-revisions")
def google_revisions(document_id:int,session:Annotated[Session,Depends(get_session)],_:Annotated[BitrixIdentity,Depends(require_editor)]):
    document=session.get(KnowledgeDocument,document_id)
    if not document: raise HTTPException(404,"Документ не найден")
    token=_google_access_token(session); file_id=_google_file_id(document.document_url)
    response=httpx.get(f"https://www.googleapis.com/drive/v3/files/{file_id}/revisions",params={"pageSize":200,"fields":"revisions(id,modifiedTime,keepForever,published),nextPageToken"},headers={"Authorization":f"Bearer {token}"},timeout=20)
    if response.status_code in {401,403}: raise HTTPException(403,"Google-аккаунт не имеет доступа к этому документу или Drive API не включён")
    if response.is_error: raise HTTPException(502,"Google Drive не вернул историю ревизий")
    return [{"id":str(row.get("id") or ""),"modifiedTime":row.get("modifiedTime"),"label":f"Ревизия от {str(row.get('modifiedTime') or '')[:10]}","keepForever":bool(row.get("keepForever"))} for row in response.json().get("revisions",[])]


@router.get("/help/preferences")
def help_preferences(session:Annotated[Session,Depends(get_session)],identity:Annotated[BitrixIdentity,Depends(require_bitrix_identity)]):
    return {row.help_key:row.hidden for row in session.exec(select(UserHelpPreference).where(UserHelpPreference.user_id==identity.user.id)).all()}


@router.put("/help/preferences/{help_key}")
def save_help_preference(help_key:str,payload:HelpPreferenceWrite,session:Annotated[Session,Depends(get_session)],identity:Annotated[BitrixIdentity,Depends(require_bitrix_identity)]):
    row=session.exec(select(UserHelpPreference).where(UserHelpPreference.user_id==identity.user.id,UserHelpPreference.help_key==help_key)).first()
    if row is None: row=UserHelpPreference(user_id=identity.user.id,help_key=help_key)
    row.hidden=payload.hidden; row.updated_at=utcnow(); session.add(row); session.commit(); return {"helpKey":help_key,"hidden":row.hidden}
