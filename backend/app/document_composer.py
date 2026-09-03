"""Conversion of a Google Docs response into a safe, responsive reader model.

The client never receives Google HTML. It gets a small, allow-listed document AST
which keeps text searchable and makes unsupported objects explicit visual islands.
"""
from __future__ import annotations

import hashlib
import json
import re
from typing import Any


def _text_style(value: dict[str, Any]) -> dict[str, Any]:
    rgb = ((value.get("foregroundColor") or {}).get("color") or {}).get("rgbColor") or {}
    color = ""
    if rgb:
        color = "#%02x%02x%02x" % tuple(round(float(rgb.get(part, 0)) * 255) for part in ("red", "green", "blue"))
    return {key: item for key, item in {
        "bold": bool(value.get("bold")), "italic": bool(value.get("italic")),
        "underline": bool(value.get("underline")), "link": (value.get("link") or {}).get("url", ""),
        "color": color,
    }.items() if item}


def _paragraph(element: dict[str, Any], inline_objects: dict[str, Any]) -> dict[str, Any] | None:
    paragraph = element.get("paragraph") or {}
    parts: list[dict[str, Any]] = []
    images: list[dict[str, Any]] = []
    for child in paragraph.get("elements") or []:
        run = child.get("textRun")
        if run:
            text = str(run.get("content") or "").replace("\n", "")
            if text:
                parts.append({"text": text, "style": _text_style(run.get("textStyle") or {})})
        inline = child.get("inlineObjectElement") or {}
        object_id = inline.get("inlineObjectId")
        embedded = ((inline_objects.get(object_id) or {}).get("inlineObjectProperties") or {}).get("embeddedObject") or {}
        image = embedded.get("imageProperties") or {}
        if image.get("contentUri"):
            images.append({"kind": "image", "sourceUri": image["contentUri"], "alt": embedded.get("title") or embedded.get("description") or "Иллюстрация", "width": (embedded.get("size") or {}).get("width", {}).get("magnitude", 0)})
    if images and not parts:
        return images[0]
    if not parts:
        return None
    named = str((paragraph.get("paragraphStyle") or {}).get("namedStyleType") or "")
    bullet = paragraph.get("bullet") or {}
    kind = "heading" if named.startswith("HEADING_") or named == "TITLE" else "paragraph"
    level = int(named.rsplit("_", 1)[-1]) if named.startswith("HEADING_") and named.rsplit("_", 1)[-1].isdigit() else (1 if named == "TITLE" else 0)
    node: dict[str, Any] = {"kind": kind, "spans": parts}
    if level: node["level"] = min(level, 4)
    if bullet: node["list"] = "ordered" if str(bullet.get("listId") or "").startswith("kix") else "unordered"
    if images: node["images"] = images
    return node


def _table(table: dict[str, Any], inline_objects: dict[str, Any]) -> dict[str, Any]:
    rows = []
    for row in table.get("tableRows") or []:
        cells = []
        for cell in row.get("tableCells") or []:
            content = [_paragraph(item, inline_objects) for item in cell.get("content") or []]
            cells.append([item for item in content if item])
        rows.append(cells)
    return {"kind": "table", "rows": rows}


def compose(document: dict[str, Any], comments: list[dict[str, Any]]) -> tuple[dict[str, Any], str]:
    inline_objects = document.get("inlineObjects") or {}
    pages: list[list[dict[str, Any]]] = [[]]
    for element in ((document.get("body") or {}).get("content") or []):
        if element.get("sectionBreak") and pages[-1]:
            pages.append([])
            continue
        node = _paragraph(element, inline_objects) if element.get("paragraph") else _table(element["table"], inline_objects) if element.get("table") else None
        if node:
            pages[-1].append(node)
    pages = [page for page in pages if page] or [[]]
    safe_comments = [{
        "id": str(item.get("id") or ""), "content": str(item.get("content") or ""),
        "quotedText": str((item.get("quotedFileContent") or {}).get("value") or ""),
        "author": str((item.get("author") or {}).get("displayName") or ""),
        "createdAt": str(item.get("createdTime") or ""), "resolved": bool(item.get("resolved")),
        "replies": [{"id": str(reply.get("id") or ""), "content": str(reply.get("content") or ""), "author": str((reply.get("author") or {}).get("displayName") or ""), "createdAt": str(reply.get("createdTime") or "")} for reply in item.get("replies") or [] if not reply.get("deleted")],
    } for item in comments if not item.get("deleted")]
    payload = {"version": 1, "title": str(document.get("title") or "Документ"), "pages": [{"number": index + 1, "blocks": page} for index, page in enumerate(pages)], "comments": safe_comments}
    text = re.sub(r"\s+", " ", " ".join(span.get("text", "") for page in pages for block in page for span in block.get("spans", []) if isinstance(block, dict))).strip()
    digest = hashlib.sha256(json.dumps(payload, ensure_ascii=False, sort_keys=True).encode()).hexdigest()
    payload["contentHash"] = digest
    return payload, text


def materialize_images(payload: dict[str, Any], save_image) -> dict[str, Any]:
    """Replace short-lived Google content URIs with application-owned asset URLs."""
    def visit(value: Any) -> None:
        if isinstance(value, list):
            for item in value:
                visit(item)
        elif isinstance(value, dict):
            source_uri = value.pop("sourceUri", "")
            if source_uri:
                value["assetUrl"] = save_image(source_uri)
            for child in value.values():
                visit(child)
    visit(payload)
    payload.pop("contentHash", None)
    payload["contentHash"] = hashlib.sha256(json.dumps(payload, ensure_ascii=False, sort_keys=True).encode()).hexdigest()
    return payload
