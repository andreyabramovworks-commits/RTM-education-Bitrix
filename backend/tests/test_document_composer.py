from app.document_composer import compose, materialize_images


def test_composer_preserves_text_styles_links_tables_and_comments():
    source = {
        "title": "Инструкция",
        "body": {"content": [
            {"paragraph": {"paragraphStyle": {"namedStyleType": "HEADING_2"}, "elements": [{"textRun": {"content": "2.2 Ригеля\n", "textStyle": {"bold": True}}}]}},
            {"paragraph": {"elements": [{"textRun": {"content": "Смотреть ", "textStyle": {}}}, {"textRun": {"content": "документ\n", "textStyle": {"link": {"url": "https://example.com"}}}}]}},
            {"table": {"tableRows": [{"tableCells": [{"content": [{"paragraph": {"elements": [{"textRun": {"content": "Ячейка\n", "textStyle": {}}}]}}]}]}]}},
        ]},
    }
    payload, text = compose(source, [{"id": "comment-1", "content": "Проверить схему", "quotedFileContent": {"value": "Ригеля"}, "author": {"displayName": "Анна"}}])
    assert payload["pages"][0]["blocks"][0]["kind"] == "heading"
    assert payload["pages"][0]["blocks"][1]["spans"][1]["style"]["link"] == "https://example.com"
    assert payload["pages"][0]["blocks"][2]["kind"] == "table"
    assert payload["comments"][0]["quotedText"] == "Ригеля"
    assert "Смотреть документ" in text


def test_composer_replaces_private_google_image_urls_before_publishing():
    payload = {"pages": [{"blocks": [{"kind": "image", "sourceUri": "https://docs.google.com/image", "alt": "Схема"}]}]}
    result = materialize_images(payload, lambda source: "/api/v51/documents/540/document-render/assets/scheme.png")
    image = result["pages"][0]["blocks"][0]
    assert image["assetUrl"].endswith("scheme.png")
    assert "sourceUri" not in image
    assert result["contentHash"]


def test_composer_keeps_independent_lists_typography_and_removes_control_characters():
    source = {
        "title": "Инструкция",
        "lists": {
            "list-a": {"listProperties": {"nestingLevels": [{"glyphType": "DECIMAL", "startNumber": 1}]}},
            "list-b": {"listProperties": {"nestingLevels": [{"glyphType": "DECIMAL", "startNumber": 1}]}},
        },
        "body": {"content": [
            {"paragraph": {"bullet": {"listId": "list-a"}, "paragraphStyle": {"alignment": "CENTER", "spaceAbove": {"magnitude": 12, "unit": "PT"}}, "elements": [{"textRun": {"content": "Первый\u000b\n", "textStyle": {"weightedFontFamily": {"fontFamily": "Arial"}, "fontSize": {"magnitude": 11, "unit": "PT"}}}}]}},
            {"paragraph": {"bullet": {"listId": "list-b"}, "elements": [{"textRun": {"content": "Снова первый\n", "textStyle": {}}}]}},
        ]},
    }
    payload, text = compose(source, [])
    first, second = payload["pages"][0]["blocks"]
    assert first["list"] == {"id": "list-a", "level": 0, "type": "ordered", "start": 1}
    assert second["list"]["start"] == 1
    assert first["spans"][0]["style"]["fontFamily"] == "Arial"
    assert first["spans"][0]["style"]["fontSize"] == 11.0
    assert "\u000b" not in text
