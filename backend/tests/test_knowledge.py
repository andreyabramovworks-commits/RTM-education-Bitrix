from app.knowledge import build_scene, repair_completion_button


def test_knowledge_card_uses_approved_visual_contract():
    scene = build_scene(6, "Организационная структура компании", "Организационная схема компании", "https://docs.google.com/document/d/example/edit")
    elements = scene["elements"]
    colors = {(item.get("backgroundColor"), item.get("strokeColor")) for item in elements}
    assert ("#ffec99", "#ffd43b") in colors
    assert ("#4dabf7", "#1971c2") in colors
    assert ("#38d9a9", "#099268") in colors
    assert ("#e6fcf5", "#12b886") in colors
    assert any(item.get("fontFamily") == 23 and item.get("fontSize") == 28 for item in elements)
    assert any(item.get("fontFamily") == 22 for item in elements)
    assert any(item.get("link") == "https://docs.google.com/document/d/example/edit" for item in elements)
    assert any(item.get("customData", {}).get("rtmAction") == "complete-material" for item in elements)


def test_completion_label_stays_grouped_and_centered_on_button():
    scene = build_scene(6, "Материал", "Описание", "https://example.com")
    elements = scene["elements"]
    button = next(item for item in elements if item.get("customData", {}).get("rtmCompletionCard"))
    label = next(item for item in elements if item.get("originalText") == "Завершить")
    assert button["groupIds"] == label["groupIds"]

    button["x"] = 340
    label["x"] = 20
    repaired = repair_completion_button(6, scene)
    repaired_label = next(item for item in repaired["elements"] if item.get("originalText") == "Завершить")
    assert repaired_label["x"] == 355
    assert repaired_label["width"] == button["width"] - 30
    assert repaired_label["fontFamily"] == 22
    assert repaired_label["containerId"] == button["id"]
    assert button["boundElements"] == [{"id": repaired_label["id"], "type": "text"}]
