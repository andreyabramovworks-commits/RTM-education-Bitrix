import assert from "node:assert/strict";
import test from "node:test";
import { clampReaderZoom, collectVisualRun, galleryLayout, isCaptionBlock, isVisualTable, tableCellStyle } from "../src/documentPresentation.js";

test("reader zoom stays inside the promised 100–225% range", () => {
  assert.equal(clampReaderZoom(0.25), 1);
  assert.equal(clampReaderZoom(1.5), 1.5);
  assert.equal(clampReaderZoom(3), 2.25);
});

test("visual table detection accepts only media and its centered captions", () => {
  const photo = { kind: "image", width: 200, height: 100 };
  const caption = { kind: "paragraph", style: { align: "center" }, spans: [{ text: "Крепление ригеля" }] };
  assert.equal(isCaptionBlock(caption), true);
  assert.equal(isVisualTable({ rows: [[{ items: [photo, caption] }]] }), true);
  assert.equal(isVisualTable({ rows: [[{ items: [photo, { kind: "paragraph", spans: [{ text: "Шарнирный хомут 48x67" }] }] }]] }), true);
  assert.equal(isVisualTable({ rows: [[{ items: [photo, { kind: "paragraph", spans: [{ text: "Длинное пояснение для чтения в обычной таблице, которое описывает порядок установки, требования безопасности, ограничения применения и дополнительные условия работы с элементом конструкции." }] }] }]] }), false);
});

test("cell styles preserve individual border sides instead of drawing a blanket grid", () => {
  const style = tableCellStyle({ style: { backgroundColor: "#fff4cc", paddingLeft: 8, borders: { top: { width: 1, color: "#334c66", dash: "DASH" }, right: { width: 2, color: "#111" } } } });
  assert.equal(style.backgroundColor, "#fff4cc");
  assert.equal(style.paddingLeft, "8pt");
  assert.equal(style.borderTop, "1px dashed #334c66");
  assert.equal(style.borderRight, "2px solid #111");
  assert.equal(style.borderBottom, undefined);
});

test("a lead illustration with two related drawings receives an intentional editorial composition", () => {
  const lead = { kind: "image", width: 700, height: 400 };
  const drawing = { kind: "image", width: 250, height: 170 };
  assert.equal(galleryLayout([lead, drawing, drawing]), "dc-gallery-feature-pair");
  assert.equal(galleryLayout([drawing, drawing, { kind: "image", width: 80, height: 60 }]), "dc-gallery-pair-detail");
});

test("consecutive document anchors become one figure instead of overlapping independent blocks", () => {
  const caption = { kind: "paragraph", style: { align: "center" }, spans: [{ text: "Узловая диагональ" }] };
  const run = collectVisualRun([{ kind: "image", width: 600, height: 300 }, { kind: "image", width: 220, height: 150 }, { kind: "image", width: 220, height: 150 }, caption, { kind: "paragraph", spans: [{ text: "Следующий абзац" }] }]);
  assert.equal(run.gallery.length, 3);
  assert.equal(run.caption, caption);
  assert.equal(run.nextIndex, 4);
});
