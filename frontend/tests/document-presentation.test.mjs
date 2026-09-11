import assert from "node:assert/strict";
import test from "node:test";
import { clampReaderZoom, collectVisualRun, galleryLayout, isCaptionBlock, isVisualTable, tableCellStyle, prepareDocumentPages } from "../src/documentPresentation.js";

const paragraph = (text, extra = {}) => ({ kind: "paragraph", spans: [{ text }], ...extra });
test("editorial composition keeps instructions before media and pairs tab labels in visual order across pages", () => {
  const pictures = [2, 0, 1].map((left) => ({ kind: "image", assetUrl: String(left), placement: { source: "positioned", left: left * 180, top: 16 } }));
  const pages = prepareDocumentPages({ pages: [{ blocks: [paragraph("Подготовьте фермы:", { images: pictures })] }, { blocks: [paragraph("Т39\t\tТ67\tТ100")] }] });
  const blocks = pages.flatMap((page) => page.blocks);
  assert.equal(blocks[0].spans[0].text, "Подготовьте фермы:");
  assert.deepEqual(blocks[1].images.map((image) => image.assetUrl), ["0", "1", "2"]);
  assert.deepEqual(blocks[1].captions.map((caption) => caption.spans[0].text), ["Т39", "Т67", "Т100"]);
});
test("unrelated adjacent images are not automatically one gallery", () => {
  const pages = prepareDocumentPages({ pages: [{ blocks: [{ kind: "image", assetUrl: "joint" }, { kind: "image", assetUrl: "connector" }, paragraph("Коннектор С2-80")] }] });
  assert.equal(pages[0].blocks.length, 2);
  assert.equal(pages[0].blocks[1].caption.spans[0].text, "Коннектор С2-80");
});
test("instruction paragraphs remain body text, not captions", () => {
  const instruction = paragraph("Перед установкой проверьте диаметр трубы и хомута.");
  const blocks = prepareDocumentPages({ pages: [{ blocks: [{ kind: "image" }, instruction] }] })[0].blocks;
  assert.equal(blocks.length, 2);
  assert.equal(blocks[1].spans[0].text, instruction.spans[0].text);
});

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
