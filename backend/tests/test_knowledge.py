from app.knowledge import build_scene


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
