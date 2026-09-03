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


def test_composer_keeps_multiple_images_from_one_google_anchor_as_a_group():
    source = {"inlineObjects": {"one": {"inlineObjectProperties": {"embeddedObject": {"imageProperties": {"contentUri": "https://example.com/one"}}}}, "two": {"inlineObjectProperties": {"embeddedObject": {"imageProperties": {"contentUri": "https://example.com/two"}}}}}, "body": {"content": [{"paragraph": {"elements": [{"inlineObjectElement": {"inlineObjectId": "one"}}, {"inlineObjectElement": {"inlineObjectId": "two"}}]}}]}}
    payload, _ = compose(source, [])
    group = payload["pages"][0]["blocks"][0]
    assert group["kind"] == "image-group"
    assert len(group["images"]) == 2


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


def test_composer_keeps_document_framing_outside_recomposed_article_body():
    paragraph = lambda text, named="NORMAL_TEXT": {"paragraph": {"paragraphStyle": {"namedStyleType": named}, "elements": [{"textRun": {"content": f"{text}\n", "textStyle": {}}}]}}
    source = {
        "title": "Инструкция",
        "headers": {"header": {"content": [paragraph("RTM GROUP")]}},
        "body": {"content": [paragraph("ОБУЧЕНИЕ"), paragraph("Базовое обучение как работать со строительными лесами", "HEADING_1"), paragraph("Основной текст")]} ,
        "footers": {"footer": {"content": [paragraph("Авторы инструкции: RTM group")]}},
    }
    payload, _ = compose(source, [])
    blocks = [block for page in payload["pages"] for block in page["blocks"]]
    assert blocks[0]["region"] == "header"
    assert blocks[1]["region"] == "header"
    assert "region" not in blocks[2]
    assert blocks[-1]["region"] == "closing"


def test_composer_promotes_short_bold_body_labels_to_readable_section_headings():
    source = {"body": {"content": [{"paragraph": {"elements": [{"textRun": {"content": "Хомуты типа UNA\n", "textStyle": {"bold": True}}}]}}, {"paragraph": {"elements": [{"textRun": {"content": "Обычный текст\n", "textStyle": {}}}]}}]}}
    payload, _ = compose(source, [])
    first, second = payload["pages"][0]["blocks"]
    assert first["kind"] == "heading"
    assert first["level"] == 2
    assert second["kind"] == "paragraph"
