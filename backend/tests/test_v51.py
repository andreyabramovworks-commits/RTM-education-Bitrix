from datetime import datetime, timezone

from fastapi import HTTPException

from app.models import AppUser, BitrixDepartment, KnowledgeDocument
from app.v51 import CampaignWrite, EditionDeleteWrite, _due_at, _google_file_id, _grade_linked_test, _is_in_department, _match_rules, _render_task_template, _validate_campaign


def test_department_rule_includes_nested_department():
    user = AppUser(bitrix_user_id="10", department_ids=["child"])
    departments = {
        "root": BitrixDepartment(bitrix_department_id="root", name="Root"),
        "child": BitrixDepartment(bitrix_department_id="child", name="Child", parent_id="root"),
    }
    assert _is_in_department(user, "root", True, departments)
    assert not _is_in_department(user, "root", False, departments)
    assert _match_rules(user, [{"type": "department", "id": "root", "includeChildren": True}], departments)


def test_google_document_id_supports_docs_and_query_links():
    assert _google_file_id("https://docs.google.com/document/d/abc_123-x/edit") == "abc_123-x"
    assert _google_file_id("https://drive.google.com/open?id=file_42") == "file_42"


def test_control_question_requires_correct_option():
    document = KnowledgeDocument(source_row=1, title="Документ", document_url="https://example.com")
    payload = CampaignWrite(mode="question", recipientRules=[{"type": "all_active"}], responsibleRules=[{"type": "user", "id": "1"}], question={"type": "single", "text": "Что изменилось?", "options": [{"id": "1"}, {"id": "2"}], "correct": []})
    try:
        _validate_campaign(payload, document)
    except HTTPException as error:
        assert error.status_code == 422
    else:
        raise AssertionError("Campaign without a correct option must be rejected")


def test_linked_test_must_exist_for_test_acknowledgement():
    document = KnowledgeDocument(source_row=1, title="Документ", document_url="https://example.com", light_test={"created": True, "questions": [{"id": "q1", "type": "single", "correct": [0]}]})
    _validate_campaign(CampaignWrite(mode="test", testKind="light", recipientRules=[{"type": "all_active"}], responsibleRules=[{"type": "user", "id": "1"}]), document)


def test_linked_test_is_graded_from_server_owned_answer_key():
    linked_test = {"passScore": 100, "questions": [{"id": "q1", "type": "single", "correct": [1]}]}
    assert _grade_linked_test(linked_test, {"answers": {"q1": [1]}}) == (True, 100)
    assert _grade_linked_test(linked_test, {"passed": True, "answers": {"q1": [0]}}) == (False, 0)


def test_calendar_deadline_ends_on_last_selected_day():
    assigned = datetime(2026, 8, 5, 12, 42, tzinfo=timezone.utc)
    due = _due_at(assigned, 3)
    assert due.date().isoformat() == "2026-08-08"
    assert (due.hour, due.minute, due.second) == (23, 59, 59)


def test_task_template_renders_supported_fields():
    rendered = _render_task_template("Изучить {document_title}: {edition_link}", {"document_title": "Кодекс", "edition_link": "https://example.com/edition"})
    assert rendered == "Изучить Кодекс: https://example.com/edition"


def test_campaign_rejects_unknown_task_template_field():
    document = KnowledgeDocument(source_row=1, title="Документ", document_url="https://example.com")
    payload = CampaignWrite(mode="confirm", recipientRules=[{"type": "all_active"}], responsibleRules=[{"type": "user", "id": "1"}], notificationSettings={"task": True, "taskTitle": "Изучить {unknown_field}"})
    try:
        _validate_campaign(payload, document)
    except HTTPException as error:
        assert error.status_code == 422
    else:
        raise AssertionError("Unknown task field must be rejected")


def test_edition_deletion_requires_an_iso_confirmation_date():
    assert EditionDeleteWrite(confirmationDate="2026-08-10").confirmationDate.isoformat() == "2026-08-10"
