from fastapi import HTTPException

from app.models import AppUser, BitrixDepartment, KnowledgeDocument
from app.v51 import CampaignWrite, _google_file_id, _is_in_department, _match_rules, _validate_campaign


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
    payload = CampaignWrite(mode="question", question={"type": "single", "text": "Что изменилось?", "options": [{"id": "1"}, {"id": "2"}], "correct": []})
    try:
        _validate_campaign(payload, document)
    except HTTPException as error:
        assert error.status_code == 422
    else:
        raise AssertionError("Campaign without a correct option must be rejected")


def test_linked_test_must_exist_for_test_acknowledgement():
    document = KnowledgeDocument(source_row=1, title="Документ", document_url="https://example.com", light_test={"created": True})
    _validate_campaign(CampaignWrite(mode="test", testKind="light"), document)
