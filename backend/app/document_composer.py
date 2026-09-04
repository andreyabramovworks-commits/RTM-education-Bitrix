"""Safe Google Docs -> responsive Document Composer model."""
from __future__ import annotations

import hashlib
import json
import re
from typing import Any

_CONTROL = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")


def _points(value: dict[str, Any] | None) -> float | None:
    value = value or {}
    magnitude = value.get("magnitude")
    return round(float(magnitude), 2) if magnitude is not None and value.get("unit", "PT") == "PT" else None


def _clean_text(value: Any) -> str:
    return _CONTROL.sub("", str(value or "")).replace("\n", "")


def _text_style(value: dict[str, Any]) -> dict[str, Any]:
    rgb = ((value.get("foregroundColor") or {}).get("color") or {}).get("rgbColor") or {}
    color = "#%02x%02x%02x" % tuple(round(float(rgb.get(part, 0)) * 255) for part in ("red", "green", "blue")) if rgb else ""
    family = ((value.get("weightedFontFamily") or {}).get("fontFamily") or value.get("fontFamily") or "").strip()
    return {key: item for key, item in {"bold": bool(value.get("bold")), "italic": bool(value.get("italic")), "underline": bool(value.get("underline")), "strikethrough": bool(value.get("strikethrough")), "link": (value.get("link") or {}).get("url", ""), "color": color, "fontFamily": family, "fontSize": _points(value.get("fontSize"))}.items() if item not in (False, "", None)}


def _paragraph_style(value: dict[str, Any]) -> dict[str, Any]:
    return {key: item for key, item in {"align": str(value.get("alignment") or "").lower(), "spaceAbove": _points(value.get("spaceAbove")), "spaceBelow": _points(value.get("spaceBelow")), "lineSpacing": value.get("lineSpacing"), "indentStart": _points(value.get("indentStart")), "indentEnd": _points(value.get("indentEnd")), "indentFirstLine": _points(value.get("indentFirstLine"))}.items() if item not in ("", None)}


def _image(embedded: dict[str, Any], placement: dict[str, Any] | None = None) -> dict[str, Any] | None:
    image = embedded.get("imageProperties") or {}
    if not image.get("contentUri"):
        return None
    size = embedded.get("size") or {}
    node = {"kind": "image", "sourceUri": image["contentUri"], "alt": embedded.get("title") or embedded.get("description") or "Иллюстрация", "width": _points(size.get("width")), "height": _points(size.get("height"))}
    if placement:
        node["placement"] = placement
    return node


def _positioned_image(positioned: dict[str, Any], object_id: str) -> dict[str, Any] | None:
    properties = positioned.get("positionedObjectProperties") or {}
    positioning = properties.get("positioning") or {}
    placement = {
        "source": "positioned",
        "layout": str(positioning.get("layout") or "POSITIONED_OBJECT_LAYOUT_UNSPECIFIED"),
        "left": _points(positioning.get("leftOffset")),
        "top": _points(positioning.get("topOffset")),
        "anchorId": object_id,
    }
    return _image(properties.get("embeddedObject") or {}, placement)


def _list_meta(bullet: dict[str, Any], lists: dict[str, Any]) -> dict[str, Any] | None:
    if not bullet:
        return None
    list_id, level = str(bullet.get("listId") or ""), int(bullet.get("nestingLevel") or 0)
    levels = ((lists.get(list_id) or {}).get("listProperties") or {}).get("nestingLevels") or []
    definition = levels[level] if level < len(levels) else {}
    ordered = bool(definition.get("glyphType") or definition.get("glyphFormat"))
    return {"id": list_id, "level": level, "type": "ordered" if ordered else "unordered", "start": int(definition.get("startNumber") or 1)}


def _paragraph(element: dict[str, Any], inline: dict[str, Any], positioned: dict[str, Any], lists: dict[str, Any]) -> dict[str, Any] | None:
    paragraph, parts, images = element.get("paragraph") or {}, [], []
    for child in paragraph.get("elements") or []:
        if run := child.get("textRun"):
            if text := _clean_text(run.get("content")):
                parts.append({"text": text, "style": _text_style(run.get("textStyle") or {})})
        object_id = (child.get("inlineObjectElement") or {}).get("inlineObjectId")
        embedded = ((inline.get(object_id) or {}).get("inlineObjectProperties") or {}).get("embeddedObject") or {}
        if image := _image(embedded): images.append(image)
    for object_id in paragraph.get("positionedObjectIds") or []:
        if image := _positioned_image(positioned.get(object_id) or {}, str(object_id)):
            images.append(image)
    if images and not parts:
        return images[0] if len(images) == 1 else {"kind": "image-group", "images": images}
    if not parts:
        return None
    named = str((paragraph.get("paragraphStyle") or {}).get("namedStyleType") or "")
    level = int(named.rsplit("_", 1)[-1]) if named.startswith("HEADING_") and named.rsplit("_", 1)[-1].isdigit() else (1 if named == "TITLE" else 0)
    node: dict[str, Any] = {"kind": "heading" if level else "paragraph", "spans": parts, "style": _paragraph_style(paragraph.get("paragraphStyle") or {})}
    if level: node["level"] = min(level, 4)
    if listing := _list_meta(paragraph.get("bullet") or {}, lists): node["list"] = listing
    if images: node["images"] = images
    return node


def _table(table: dict[str, Any], inline: dict[str, Any], positioned: dict[str, Any], lists: dict[str, Any]) -> dict[str, Any]:
    has_borders = False
    rows: list[list[dict[str, Any]]] = []
    for row in table.get("tableRows") or []:
        cells: list[dict[str, Any]] = []
        for cell in row.get("tableCells") or []:
            style = cell.get("tableCellStyle") or {}
            borders = (style.get(name) or {} for name in ("borderTop", "borderBottom", "borderLeft", "borderRight"))
            has_borders = has_borders or any((_points(border.get("width")) or 0) > 0 for border in borders)
            items = [item for item in (_paragraph(element, inline, positioned, lists) for element in cell.get("content") or []) if item]
            cells.append({"items": items, "colSpan": max(1, int(style.get("columnSpan") or 1)), "rowSpan": max(1, int(style.get("rowSpan") or 1))})
        rows.append(cells)
    return {"kind": "table", "rows": rows, "hasBorders": has_borders}


def _split_pages(blocks: list[dict[str, Any]], page_breaks: set[int]) -> list[list[dict[str, Any]]]:
    pages, units = [[]], 0
    for index, block in enumerate(blocks):
        if (index in page_breaks or units > 52) and pages[-1]: pages.append([]); units = 0
        pages[-1].append(block)
        units += 9 if block.get("kind") == "image" else 12 if block.get("kind") == "table" else max(1, sum(len(item.get("text", "")) for item in block.get("spans", [])) // 85 + 1)
    return [page for page in pages if page] or [[]]


def _block_text(block: dict[str, Any]) -> str:
    return " ".join(span.get("text", "") for span in block.get("spans", [])).strip().casefold()


def _mark_document_regions(blocks: list[dict[str, Any]], document_title: str) -> None:
    """Keep the document's framing intact while the article body is re-composed."""
    title = _clean_text(document_title).casefold()
    first_heading = next((index for index, block in enumerate(blocks) if block.get("kind") == "heading" and len(_block_text(block)) > 20), None)
    if first_heading is None and title:
        first_heading = next((index for index, block in enumerate(blocks) if title in _block_text(block)), None)
    if first_heading is not None and first_heading <= 10:
        for block in blocks[:first_heading]:
            block.setdefault("region", "header")
    closing_markers = ("авторы инструкции", "утверждено", "группа компаний")
    closing_start = next((index for index, block in enumerate(blocks) if any(marker in _block_text(block) for marker in closing_markers)), None)
    if closing_start is not None:
        for block in blocks[closing_start:]:
            block.setdefault("region", "closing")


def _apply_editorial_roles(blocks: list[dict[str, Any]]) -> None:
    """Give short, fully bold body labels a readable section role."""
    for block in blocks:
        text = _block_text(block)
        spans = block.get("spans") or []
        if block.get("region") or block.get("kind") != "paragraph" or block.get("list") or not 4 <= len(text) <= 100:
            continue
        if spans and all(span.get("style", {}).get("bold") for span in spans):
            block["kind"] = "heading"
            block["level"] = 2


def compose(document: dict[str, Any], comments: list[dict[str, Any]]) -> tuple[dict[str, Any], str]:
    inline, positioned, lists = document.get("inlineObjects") or {}, document.get("positionedObjects") or {}, document.get("lists") or {}
    blocks: list[dict[str, Any]] = []
    for header in (document.get("headers") or {}).values():
        for item in (_paragraph(element, inline, positioned, lists) for element in header.get("content") or []):
            if item:
                item["region"] = "header"
                blocks.append(item)
    page_breaks: set[int] = set()
    for element in ((document.get("body") or {}).get("content") or []):
        if element.get("sectionBreak") and blocks: page_breaks.add(len(blocks)); continue
        node = _paragraph(element, inline, positioned, lists) if element.get("paragraph") else _table(element["table"], inline, positioned, lists) if element.get("table") else None
        if node: blocks.append(node)
    for footer in (document.get("footers") or {}).values():
        for item in (_paragraph(element, inline, positioned, lists) for element in footer.get("content") or []):
            if item:
                item["region"] = "closing"
                blocks.append(item)
    _mark_document_regions(blocks, str(document.get("title") or ""))
    _apply_editorial_roles(blocks)
    pages = _split_pages(blocks, page_breaks)
    safe_comments = [{"id": str(item.get("id") or ""), "content": _clean_text(item.get("content")), "quotedText": _clean_text((item.get("quotedFileContent") or {}).get("value")), "author": str((item.get("author") or {}).get("displayName") or ""), "createdAt": str(item.get("createdTime") or ""), "resolved": bool(item.get("resolved")), "replies": [{"id": str(reply.get("id") or ""), "content": _clean_text(reply.get("content")), "author": str((reply.get("author") or {}).get("displayName") or ""), "createdAt": str(reply.get("createdTime") or "")} for reply in item.get("replies") or [] if not reply.get("deleted")]} for item in comments if not item.get("deleted")]
    payload = {"version": 2, "title": str(document.get("title") or "Документ"), "pages": [{"number": index + 1, "blocks": page} for index, page in enumerate(pages)], "comments": safe_comments}
    text = re.sub(r"\s+", " ", " ".join(span.get("text", "") for block in blocks for span in block.get("spans", []))).strip()
    payload["contentHash"] = hashlib.sha256(json.dumps(payload, ensure_ascii=False, sort_keys=True).encode()).hexdigest()
    return payload, text


def materialize_images(payload: dict[str, Any], save_image) -> dict[str, Any]:
    def visit(value: Any) -> None:
        if isinstance(value, list):
            for item in value: visit(item)
        elif isinstance(value, dict):
            if source_uri := value.pop("sourceUri", ""): value["assetUrl"] = save_image(source_uri)
            for child in value.values(): visit(child)
    visit(payload)
    payload["contentHash"] = hashlib.sha256(json.dumps(payload, ensure_ascii=False, sort_keys=True).encode()).hexdigest()
    return payload
