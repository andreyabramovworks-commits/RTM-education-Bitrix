from __future__ import annotations

import hashlib
import json
from pathlib import Path
import re
import textwrap
from typing import Annotated, Any

from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel, Field as PydanticField
from sqlmodel import Session, select

from app.bitrix_auth import BitrixIdentity, bitrix_call, require_admin, require_bitrix_identity, require_editor
from app.config import get_settings
from app.database import get_session
from app.models import AppUser, BitrixDepartment, KnowledgeDocument, LegacyRecord, utcnow

router = APIRouter(prefix="/api/v47/knowledge", tags=["knowledge"])
CATALOG = Path(__file__).with_name("data") / "knowledge_catalog.json"


def _id(row: int, name: str) -> str:
    return hashlib.sha1(f"kb:{row}:{name}".encode()).hexdigest()[:20]


def _wrap(value: str, width: int) -> list[str]:
    return textwrap.wrap(re.sub(r"\s+", " ", value).strip(), width=width, break_long_words=False) or [""]


def build_scene(row: int, title: str, description: str, url: str) -> dict[str, Any]:
    # Excalidraw preserves the explicit line breaks that are stored in a scene.
    # One conservative measure is therefore used for both wrapping and card
    # height; this prevents text from ever escaping a generated card.
    def scene_lines(value: str, width: int, size: int) -> list[str]:
        return _wrap(value, max(12, int(width / (size * 0.62))))
    title_lines = scene_lines(title.upper(), 500, 28)
    blue = description.strip() or f"В документе представлен материал «{title}». Изучите его, чтобы применять установленные правила и порядок работы."
    yellow = f"В этом обучении вы изучите материал «{title}» и узнаете, как использовать его в ежедневной работе."
    yellow_lines, blue_lines = scene_lines(yellow, 444, 20), scene_lines(blue, 444, 20)
    finish_value = "Не забудь нажать кнопку «Завершить», чтобы получить доступ к следующему материалу!"
    finish_lines = scene_lines(finish_value, 444, 18)
    title_h = len(title_lines) * 35
    yellow_h = max(96, len(yellow_lines) * 25 + 46)
    blue_h = max(96, len(blue_lines) * 25 + 46)
    y_title = 28; y_yellow = y_title + title_h + 40; y_blue = y_yellow + yellow_h + 64
    y_link = y_blue + blue_h + 64; link_h = 130; y_finish = y_link + link_h + 64
    finish_h = max(150, len(finish_lines) * 23 + 92)
    outer_h = y_finish + finish_h + 30
    def rect(name: str, x: int, y: int, w: int, h: int, bg: str, stroke: str, extra=None):
        return {"id": _id(row,name), "type":"rectangle", "x":x,"y":y,"width":w,"height":h,"angle":0,"strokeColor":stroke,"backgroundColor":bg,"fillStyle":"solid","strokeWidth":3,"strokeStyle":"solid","roughness":0,"opacity":100,"groupIds":[],"frameId":None,"roundness":{"type":3},"seed":row,"version":1,"versionNonce":row*31,"isDeleted":False,"boundElements":[],"updated":0,"link":None,"locked":False, **(extra or {})}
    frame_id = _id(row, "viewport")
    def text(name: str, value: str, x: int, y: int, w: int, size: int, font: int, align="left", color="#111827", link=None):
        wrapped = scene_lines(value, w, size)
        return {"id":_id(row,name),"type":"text","x":x,"y":y,"width":w,"height":len(wrapped)*int(size*1.25),"angle":0,"strokeColor":color,"backgroundColor":"transparent","fillStyle":"solid","strokeWidth":1,"strokeStyle":"solid","roughness":0,"opacity":100,"groupIds":[],"frameId":None,"roundness":None,"seed":row+1,"version":1,"versionNonce":row*37,"isDeleted":False,"boundElements":[],"updated":0,"link":link,"locked":False,"fontSize":size,"fontFamily":font,"text":"\n".join(wrapped),"originalText":value,"textAlign":align,"verticalAlign":"middle","containerId":None,"lineHeight":1.25}
    viewport = rect("viewport",10,10,580,outer_h,"transparent","#b8b8b8")
    viewport.update({"id": frame_id, "type": "frame", "name": title, "roundness": None})
    els=[viewport, text("title",title.upper(),50,y_title,500,28,23,"center")]
    els += [rect("yellow",50,y_yellow,500,yellow_h,"#ffec99","#ffd43b"), text("yellow-text",yellow,78,y_yellow+21,444,20,22)]
    els += [rect("blue",50,y_blue,500,blue_h,"#4dabf7","#1971c2"), text("blue-text",blue,78,y_blue+21,444,20,22)]
    els += [rect("link",50,y_link,500,link_h,"#38d9a9","#099268"), rect("link-button",90,y_link+28,420,55,"#ffffff","#099268"), text("link-text",title,108,y_link+38,384,18,22,"center","#099268",url), text("link-help","Нажми, чтобы перейти по ссылке",100,y_link+94,400,13,22,"center")]
    completion_id = _id(row, "completion")
    button_y = y_finish + finish_h - 60
    els += [rect("finish",50,y_finish,500,finish_h,"#e6fcf5","#12b886"), text("finish-help",finish_value,78,y_finish+22,444,18,22), rect("finish-button",210,button_y,180,42,"#12b886","#099268",{"link":"#rtm-complete-material","customData":{"rtmAction":"complete-material","rtmCompletionCard":True,"rtmCompletionId":completion_id}}), text("finish-text","Завершить",225,button_y+8,150,17,22,"center","#ffffff")]
    for index, (a,b) in enumerate(((y_yellow+yellow_h,y_blue),(y_blue+blue_h,y_link),(y_link+link_h,y_finish))):
        els.append({"id":_id(row,f"arrow-{index}"),"type":"arrow","x":300,"y":a+12,"width":0,"height":b-a-24,"angle":0,"strokeColor":"#111827","backgroundColor":"transparent","fillStyle":"solid","strokeWidth":2,"strokeStyle":"solid","roughness":0,"opacity":100,"groupIds":[],"frameId":None,"roundness":{"type":2},"seed":row+index,"version":1,"versionNonce":row*41+index,"isDeleted":False,"boundElements":[],"updated":0,"link":None,"locked":False,"points":[[0,0],[0,b-a-24]],"lastCommittedPoint":None,"startBinding":None,"endBinding":None,"startArrowhead":None,"endArrowhead":"arrow"})
    for element in els:
        if element["id"] != frame_id:
            element["frameId"] = frame_id
    return {"type":"excalidraw","version":2,"source":"rtm-v50.3.9","elements":els,"appState":{"viewBackgroundColor":"#ffffff","scrollX":0,"scrollY":0,"zoom":{"value":1}},"files":{}}


def ensure_catalog(session: Session) -> None:
    existing = session.exec(select(KnowledgeDocument)).all()
    if existing:
        changed = False
        for document in existing:
            scene = document.scene if isinstance(document.scene, dict) else {}
            if scene.get("source") not in {"rtm-v50.3.6", "rtm-v50.3.7", "rtm-v50.3.8"}:
                continue
            document.scene = build_scene(document.source_row, document.title, document.description, document.document_url)
            session.add(document)
            changed = True
        if changed:
            session.commit()
        return
    payload = json.loads(CATALOG.read_text(encoding="utf-8"))
    for source in payload["documents"]:
        row, title, description, url = source["row"], source["title"], source["description"], source["links"][0]
        session.add(KnowledgeDocument(source_row=row,title=title,description=description,document_url=url,scene=build_scene(row,title,description,url),light_test={"title":f"Лайт — {title}","kind":"light","created":False,"questions":[]},full_test={"title":f"Полный — {title}","kind":"full","created":False,"questions":[]},article_assignments=[{"type":"all_active"}],reviewers=[{"type":"role","id":"admin"},{"type":"user","id":"36"}],editors=[{"type":"role","id":"admin"},{"type":"user","id":"36"}]))
    session.commit()


def _document(row: KnowledgeDocument, include_scene=False) -> dict[str, Any]:
    data={"id":row.id,"sourceRow":row.source_row,"title":row.title,"description":row.description,"documentUrl":row.document_url,"lightTest":row.light_test,"fullTest":row.full_test,"articleAssignments":row.article_assignments,"lightTestAssignments":row.light_test_assignments,"fullTestAssignments":row.full_test_assignments,"reviewers":row.reviewers,"editors":row.editors,"articleReviewers":row.reviewers,"articleEditors":row.editors,"lightTestReviewers":row.light_test_reviewers,"fullTestReviewers":row.full_test_reviewers,"lightTestEditors":row.light_test_editors,"fullTestEditors":row.full_test_editors,"inheritTestAssignments":row.inherit_test_assignments,"active":row.active}
    if include_scene: data["scene"]=row.scene
    return data


def _allows(
    rules: list,
    identity: BitrixIdentity,
    departments: dict[str, BitrixDepartment],
) -> bool:
    if identity.user.role in {"developer", "admin"}:
        return True
    if not rules:
        return False
    user_id = str(identity.user.bitrix_user_id)
    user_departments = {str(value) for value in identity.user.department_ids or []}
    expanded_departments = set(user_departments)
    for department_id in list(user_departments):
        current = departments.get(department_id)
        visited: set[str] = set()
        while current and current.parent_id and current.parent_id not in visited:
            visited.add(current.parent_id)
            expanded_departments.add(current.parent_id)
            current = departments.get(current.parent_id)
    for rule in rules:
        kind = str(rule.get("type") or "")
        value = str(rule.get("id") or "")
        if kind == "all_active" and identity.user.active:
            return True
        if kind == "user" and value == user_id:
            return True
        if kind == "department" and value in expanded_departments:
            return True
        if kind == "role" and value == identity.user.role:
            return True
    return False


def _visible_document(
    row: KnowledgeDocument,
    identity: BitrixIdentity,
    departments: dict[str, BitrixDepartment],
    include_scene: bool = False,
) -> dict[str, Any] | None:
    if not _allows(row.article_assignments, identity, departments):
        return None
    data = _document(row, include_scene)
    if not _allows(row.light_test_assignments, identity, departments):
        data["lightTest"] = {**(row.light_test or {}), "created": False}
    if not _allows(row.full_test_assignments, identity, departments):
        data["fullTest"] = {**(row.full_test or {}), "created": False}
    return data


class KnowledgeUpdate(BaseModel):
    title: str | None=None; description: str | None=None; documentUrl: str | None=None
    scene: dict | None=None
    lightTest: dict | None=None; fullTest: dict | None=None
    articleAssignments: list | None=None; lightTestAssignments: list | None=None; fullTestAssignments: list | None=None
    reviewers: list | None=None; editors: list | None=None
    articleReviewers: list | None=None; articleEditors: list | None=None
    lightTestReviewers: list | None=None; fullTestReviewers: list | None=None
    lightTestEditors: list | None=None; fullTestEditors: list | None=None
    inheritTestAssignments: bool | None=None; active: bool | None=None


@router.get("/documents")
def documents(session: Annotated[Session,Depends(get_session)], identity: Annotated[BitrixIdentity,Depends(require_bitrix_identity)]):
    ensure_catalog(session)
    departments = {
        row.bitrix_department_id: row
        for row in session.exec(select(BitrixDepartment).where(BitrixDepartment.active == True)).all()
    }
    result = [
        _visible_document(row, identity, departments)
        for row in session.exec(select(KnowledgeDocument).order_by(KnowledgeDocument.source_row)).all()
        if row.active
    ]
    return [row for row in result if row is not None]

@router.get("/documents/{document_id}")
def document(document_id:int, session:Annotated[Session,Depends(get_session)], identity:Annotated[BitrixIdentity,Depends(require_bitrix_identity)]):
    ensure_catalog(session); row=session.get(KnowledgeDocument,document_id)
    if not row or not row.active: raise HTTPException(404,"Knowledge document not found")
    departments = {
        item.bitrix_department_id: item
        for item in session.exec(select(BitrixDepartment).where(BitrixDepartment.active == True)).all()
    }
    visible = _visible_document(row, identity, departments, True)
    if visible is None:
        raise HTTPException(403, "Knowledge document is not assigned to this user")
    return visible


@router.get("/documents/{document_id}/linked/{kind}")
def linked_document(
    document_id: int,
    kind: str,
    session: Annotated[Session, Depends(get_session)],
    identity: Annotated[BitrixIdentity, Depends(require_bitrix_identity)],
    course_item_id: str | None = None,
):
    if kind not in {"article", "light", "full"}:
        raise HTTPException(422, "Linked kind must be article, light or full")
    ensure_catalog(session)
    row = session.get(KnowledgeDocument, document_id)
    if not row or not row.active:
        raise HTTPException(404, "Knowledge document not found")
    departments = {
        item.bitrix_department_id: item
        for item in session.exec(select(BitrixDepartment).where(BitrixDepartment.active == True)).all()
    }
    course_reference = False
    if course_item_id:
        record = session.exec(select(LegacyRecord).where(
            LegacyRecord.entity == "rtm_items",
            LegacyRecord.legacy_id == str(course_item_id),
        )).first()
        props = record.properties if record else {}
        raw_meta = props.get("meta") or {}
        try:
            meta = json.loads(raw_meta) if isinstance(raw_meta, str) else raw_meta
        except (TypeError, json.JSONDecodeError):
            meta = {}
        course_reference = bool(
            meta.get("linkedKnowledge")
            and int(meta.get("knowledgeDocumentId") or 0) == document_id
            and str(meta.get("knowledgeKind") or "") == kind
        )
        if not course_reference:
            raise HTTPException(404, "Linked course material not found")
    if not course_reference and not _allows(row.article_assignments, identity, departments):
        raise HTTPException(403, "Knowledge document is not assigned to this user")
    if kind == "article":
        return {"id": row.id, "title": row.title, "kind": kind, "scene": row.scene}
    test = row.light_test if kind == "light" else row.full_test
    if not test.get("created"):
        raise HTTPException(404, "Knowledge test has not been created")
    return {"id": row.id, "title": test.get("title") or row.title, "kind": kind, "test": test}

@router.put("/documents/{document_id}")
def update_document(document_id:int,payload:KnowledgeUpdate,session:Annotated[Session,Depends(get_session)],_:Annotated[BitrixIdentity,Depends(require_editor)]):
    row=session.get(KnowledgeDocument,document_id)
    if not row: raise HTTPException(404,"Knowledge document not found")
    mapping={"documentUrl":"document_url","lightTest":"light_test","fullTest":"full_test","articleAssignments":"article_assignments","lightTestAssignments":"light_test_assignments","fullTestAssignments":"full_test_assignments","articleReviewers":"reviewers","articleEditors":"editors","lightTestReviewers":"light_test_reviewers","fullTestReviewers":"full_test_reviewers","lightTestEditors":"light_test_editors","fullTestEditors":"full_test_editors","inheritTestAssignments":"inherit_test_assignments"}
    for key,value in payload.model_dump(exclude_unset=True).items(): setattr(row,mapping.get(key,key),value)
    if payload.inheritTestAssignments:
        row.light_test_assignments = list(row.article_assignments)
        row.full_test_assignments = list(row.article_assignments)
        row.light_test_reviewers = list(row.reviewers)
        row.full_test_reviewers = list(row.reviewers)
        row.light_test_editors = list(row.editors)
        row.full_test_editors = list(row.editors)
    if "scene" not in payload.model_fields_set and any(k in payload.model_fields_set for k in ("title","description","documentUrl")):
        row.scene=build_scene(row.source_row,row.title,row.description,row.document_url)
    row.updated_at=utcnow(); session.add(row); session.commit(); return _document(row,True)

@router.delete("/documents/{document_id}")
def delete_document(document_id:int,session:Annotated[Session,Depends(get_session)],_:Annotated[BitrixIdentity,Depends(require_admin)]):
    row=session.get(KnowledgeDocument,document_id)
    if not row: raise HTTPException(404,"Knowledge document not found")
    raise HTTPException(409,"Центральные статьи и тесты нельзя удалять. Их можно только редактировать.")

@router.post("/documents/{document_id}/tests/{kind}")
def create_test(document_id:int,kind:str,session:Annotated[Session,Depends(get_session)],_:Annotated[BitrixIdentity,Depends(require_editor)]):
    if kind not in {"light","full"}: raise HTTPException(422,"Test kind must be light or full")
    row=session.get(KnowledgeDocument,document_id)
    if not row: raise HTTPException(404,"Knowledge document not found")
    test=dict(row.light_test if kind=="light" else row.full_test)
    test.update({"kind":kind,"created":True,"questions":test.get("questions") or []})
    if kind=="light": row.light_test=test
    else: row.full_test=test
    row.updated_at=utcnow(); session.add(row); session.commit()
    return {"created":True,"test":test}

@router.get("/directory")
def directory(session:Annotated[Session,Depends(get_session)],_:Annotated[BitrixIdentity,Depends(require_bitrix_identity)]):
    ensure_catalog(session); users=session.exec(select(AppUser).where(AppUser.active==True)).all(); deps=session.exec(select(BitrixDepartment).where(BitrixDepartment.active==True)).all()
    return {"users":[{"id":u.bitrix_user_id,"name":f"{u.first_name} {u.last_name}".strip(),"departmentIds":u.department_ids,"role":u.role,"reviewerAllowed":u.role in {"teacher","editor","admin","developer"},"editorAllowed":u.role in {"teacher","editor","admin","developer"}} for u in users],"departments":[{"id":d.bitrix_department_id,"name":d.name,"parentId":d.parent_id,"headUserId":d.head_user_id} for d in deps],"documents":[{"id":d.id,"title":d.title,"tests":[d.light_test.get("title"),d.full_test.get("title")]} for d in session.exec(select(KnowledgeDocument).where(KnowledgeDocument.active==True)).all()]}

@router.post("/directory/refresh")
def refresh_directory(session:Annotated[Session,Depends(get_session)],identity:Annotated[BitrixIdentity,Depends(require_admin)]):
    raw_users=bitrix_call(identity,"user.get",{"FILTER":{"ACTIVE":"Y"}}) or []; raw_departments=bitrix_call(identity,"department.get",{}) or []
    for source in raw_users:
        bitrix_id=str(source.get("ID") or "")
        if not bitrix_id: continue
        user=session.exec(select(AppUser).where(AppUser.bitrix_user_id==bitrix_id)).first() or AppUser(bitrix_user_id=bitrix_id)
        user.first_name=str(source.get("NAME") or ""); user.last_name=str(source.get("LAST_NAME") or ""); user.email=str(source.get("EMAIL") or ""); user.department_ids=[str(x) for x in source.get("UF_DEPARTMENT") or []]; user.active=True; user.updated_at=utcnow(); session.add(user)
    for source in raw_departments:
        dep_id=str(source.get("ID") or "")
        if not dep_id: continue
        dep=session.exec(select(BitrixDepartment).where(BitrixDepartment.bitrix_department_id==dep_id)).first() or BitrixDepartment(bitrix_department_id=dep_id,name="")
        dep.name=str(source.get("NAME") or ""); dep.parent_id=str(source.get("PARENT") or ""); dep.head_user_id=str(source.get("UF_HEAD") or ""); dep.active=True; dep.updated_at=utcnow(); session.add(dep)
    session.commit(); return {"users":len(raw_users),"departments":len(raw_departments)}

class SheetChange(BaseModel):
    row: int
    title: str | None = None
    description: str | None = None
    articleAssignments: list | None = None
    reviewers: list | None = None
    editors: list | None = None


class SheetSync(BaseModel):
    # Only values that were actually changed in the sheet are sent.  This
    # avoids an empty cell accidentally overwriting a newer server value.
    changes: list[SheetChange] = PydanticField(default_factory=list)


def _sheet_state(session: Session) -> dict[str, Any]:
    documents = [_document(x) for x in session.exec(select(KnowledgeDocument).order_by(KnowledgeDocument.source_row)).all()]
    users = session.exec(select(AppUser).where(AppUser.active == True)).all()
    departments = session.exec(select(BitrixDepartment).where(BitrixDepartment.active == True)).all()
    children = {d.bitrix_department_id: {d.bitrix_department_id} for d in departments}
    changed = True
    while changed:
        changed = False
        for department in departments:
            if department.parent_id in children:
                before = len(children[department.parent_id])
                children[department.parent_id] |= children[department.bitrix_department_id]
                changed = changed or len(children[department.parent_id]) != before
    names = {u.bitrix_user_id: f"{u.first_name} {u.last_name}".strip() for u in users}
    directory_rows = []
    for department in departments:
        member_names = [names[user.bitrix_user_id] for user in users if set(map(str, user.department_ids or [])) & children[department.bitrix_department_id]]
        directory_rows.append({"id": department.bitrix_department_id, "name": department.name, "head": names.get(department.head_user_id, ""), "employees": member_names})
    return {"documents": documents, "directory": {"users": [{"id": user.bitrix_user_id, "name": names[user.bitrix_user_id], "reviewerAllowed": user.role in {"teacher", "editor", "admin", "developer"}} for user in users], "departments": directory_rows}}


def _sheet_secret(secret: str | None) -> None:
    if not get_settings().knowledge_sync_secret or secret != get_settings().knowledge_sync_secret:
        raise HTTPException(403, "Knowledge synchronization secret is invalid")


@router.get("/sheet-state")
def sheet_state(session: Annotated[Session, Depends(get_session)], x_rtm_knowledge_secret: Annotated[str | None, Header()] = None):
    _sheet_secret(x_rtm_knowledge_secret)
    ensure_catalog(session)
    return _sheet_state(session)

@router.post("/sheet-sync")
def sheet_sync(payload:SheetSync,session:Annotated[Session,Depends(get_session)],x_rtm_knowledge_secret:Annotated[str|None,Header()]=None):
    _sheet_secret(x_rtm_knowledge_secret)
    ensure_catalog(session)
    for source in payload.changes:
        row=session.exec(select(KnowledgeDocument).where(KnowledgeDocument.source_row==source.row)).first()
        if not row: continue
        content_changed = False
        if source.title is not None and source.title.strip(): row.title = source.title.strip(); content_changed = True
        if source.description is not None: row.description = source.description; content_changed = True
        if source.articleAssignments is not None: row.article_assignments = source.articleAssignments
        if source.reviewers is not None: row.reviewers = source.reviewers
        if source.editors is not None: row.editors = source.editors
        # Do not overwrite a manually edited board for role-only changes.
        if content_changed and str((row.scene or {}).get("source", "")).startswith("rtm-v50"):
            row.scene = build_scene(row.source_row, row.title, row.description, row.document_url)
        row.source_updated_at=utcnow(); session.add(row)
    session.commit()
    return _sheet_state(session)
