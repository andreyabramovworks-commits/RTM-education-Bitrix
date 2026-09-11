export const clampReaderZoom = (value) => Math.min(2.25, Math.max(1, value));

export const textOfBlock = (block = {}) => (block.spans || []).map((span) => span.text || "").join("").trim();

export const isImageBlock = (block = {}) => block.kind === "image" || block.kind === "image-group";

export const isFigureLabel = (block = {}) => block.kind === "paragraph"
  && !block.list
  && textOfBlock(block).length > 0
  && textOfBlock(block).length <= 140;

export const isCaptionBlock = (block = {}) => isFigureLabel(block) && block.style?.align === "center";

// Google Docs captions often use tabs/indents rather than a caption style.
// Only interpret short labels next to media; prose and instructions stay in flow.
const editorialCaption = (block) => isFigureLabel(block) && !block.images?.length
  && !/[.!?:]\s*$/.test(textOfBlock(block))
  && !/^(перед |после |важно|подготов|использу|установ|необходимо|с помощью|для этого|по сути|при |затем|далее)/i.test(textOfBlock(block));

const captionParts = (block) => textOfBlock(block).split(/\t+/).map((text) => text.trim()).filter(Boolean)
  .map((text) => ({ kind: "paragraph", spans: [{ text }] }));

export const sortPictures = (pictures = []) => {
  if (!pictures.every((picture) => picture.placement?.source === "positioned")) return pictures;
  return [...pictures].sort((a, b) => {
    const dy = (a.placement.top || 0) - (b.placement.top || 0);
    return Math.abs(dy) > 18 ? dy : (a.placement.left || 0) - (b.placement.left || 0);
  });
};

export const prepareDocumentPages = (render = {}) => {
  const source = (render.pages || []).flatMap((page) => page.blocks || []).map((block) => ({ ...block }));
  // Repair payloads created before the composer learned that a Google Docs
  // title can be NORMAL_TEXT. This keeps cached renders visually compatible.
  const titleIndex = source.findIndex((block) => render.title && textOfBlock(block).localeCompare(render.title, "ru", { sensitivity: "base" }) === 0);
  if (titleIndex > 0 && titleIndex <= 10) {
    for (let index = 0; index < titleIndex; index += 1) source[index].region ||= "header";
    source[titleIndex] = { ...source[titleIndex], kind: "heading", level: 1 };
  }
  const expanded = source.flatMap((block) => {
    if (!isImageBlock(block) && block.images?.length && !block.region) {
      const { images, ...copy } = block;
      const gallery = { kind: "image-group", images: sortPictures(images) };
      return textOfBlock(copy) ? [copy, gallery] : [gallery];
    }
    return [block];
  });
  const blocks = [];
  for (let index = 0; index < expanded.length; index += 1) {
    const block = expanded[index];
    if (!isImageBlock(block) || block.region) { blocks.push(block); continue; }
    let images = sortPictures(block.kind === "image" ? [block] : block.images || []);
    let end = index + 1;
    // Combine separate anchors only when a shared/multi-column label supplies evidence.
    let probe = end;
    const candidates = [...images];
    while (isImageBlock(expanded[probe]) && !expanded[probe].region) {
      candidates.push(...(expanded[probe].kind === "image" ? [expanded[probe]] : expanded[probe].images || []));
      probe += 1;
    }
    if (probe > end && editorialCaption(expanded[probe])
      && (captionParts(expanded[probe]).length === candidates.length || isCaptionBlock(expanded[probe]) || /^пример|^способ/i.test(textOfBlock(expanded[probe])))) {
      images = candidates; end = probe;
    }
    let caption = editorialCaption(expanded[end]) ? expanded[end++] : null;
    const following = [];
    // Wrapped explanatory prose may precede its image's label in the source.
    if (!caption && expanded[end]?.kind === "paragraph" && !expanded[end].list
      && textOfBlock(expanded[end]).length > 140 && editorialCaption(expanded[end + 1])) {
      following.push(expanded[end]); caption = expanded[end + 1]; end += 2;
    }
    if (caption && /\([^)]*$/.test(textOfBlock(caption)) && expanded[end]?.kind === "paragraph"
      && textOfBlock(expanded[end]).length < 70 && /\)/.test(textOfBlock(expanded[end]))) {
      caption = { ...caption, spans: [...caption.spans, { text: ` ${textOfBlock(expanded[end++])}` }] };
    }
    const labels = caption ? captionParts(caption) : [];
    blocks.push({ kind: "figure", images, caption: labels.length === images.length && images.length > 1 ? null : caption,
      captions: labels.length === images.length && images.length > 1 ? labels : [] });
    blocks.push(...following);
    index = end - 1;
  }
  // Pagination is presentation-only: a figure and its labels are indivisible.
  const pages = [{ number: 1, blocks: [] }];
  const counters = new Map();
  let units = 0;
  for (let block of blocks) {
    if (block.list?.type === "ordered") {
      const key = `${block.list.id}:${block.list.level || 0}`;
      const start = counters.get(key) ?? block.list.start ?? 1;
      counters.set(key, start + 1);
      block = { ...block, list: { ...block.list, start } };
    }
    const current = pages[pages.length - 1];
    if (units > 48 && current.blocks.at(-1)?.kind !== "heading" && !block.region) {
      pages.push({ number: pages.length + 1, blocks: [] }); units = 0;
    }
    pages.at(-1).blocks.push(block);
    units += block.kind === "figure" ? 14 : block.kind === "table" ? 18 : Math.max(2, textOfBlock(block).length / 75);
  }
  return pages;
};

export const partsOfCell = (cell = {}) => cell.items || [];

export const isVisualTable = (table = {}) => {
  const parts = (table.rows || []).flat().flatMap(partsOfCell);
  return parts.some(isImageBlock) && parts.every((part) => isImageBlock(part) || isFigureLabel(part));
};

export const collectVisualRun = (items = [], start = 0) => {
  const gallery = [];
  let index = start;
  while (isImageBlock(items[index])) {
    const item = items[index];
    gallery.push(...(item.kind === "image-group" ? item.images || [] : [item]));
    index += 1;
  }
  return { gallery, caption: isCaptionBlock(items[index]) ? items[index] : null, nextIndex: isCaptionBlock(items[index]) ? index + 1 : index };
};

export const imageAspect = (block = {}) => {
  const image = block.kind === "image" ? block : block.images?.[0];
  return image?.width && image?.height ? image.width / image.height : 0;
};

export const galleryLayout = (pictures = []) => {
  if (pictures.length !== 3) return `dc-gallery-${Math.min(pictures.length, 4)}`;
  const areas = pictures.map((picture) => {
    const image = picture.kind === "image" ? picture : picture.images?.[0] || {};
    return (image.width || 0) * (image.height || 0);
  });
  const [first, second, third] = areas;
  if (third && Math.min(first, second) > Math.max(first, second) * 0.65 && third < (first + second) * 0.28) return "dc-gallery-pair-detail";
  if (first > (second + third) * 0.72) return "dc-gallery-feature-pair";
  return "dc-gallery-3";
};

const borderValue = (border = {}) => {
  if (!border.width) return undefined;
  const dash = border.dash === "DASH" ? "dashed" : border.dash === "DOT" ? "dotted" : "solid";
  return `${Math.max(1, border.width)}px ${dash} ${border.color || "#dcd9cf"}`;
};

export const tableCellStyle = (cell = {}, visual = false, width = "") => {
  const style = cell.style || {};
  const borders = style.borders || {};
  return {
    width: visual && width ? width : undefined,
    backgroundColor: style.backgroundColor || undefined,
    textAlign: style.align || undefined,
    verticalAlign: style.contentAlignment === "MIDDLE" ? "middle" : style.contentAlignment === "BOTTOM" ? "bottom" : undefined,
    paddingTop: style.paddingTop ? `${style.paddingTop}pt` : undefined,
    paddingRight: style.paddingRight ? `${style.paddingRight}pt` : undefined,
    paddingBottom: style.paddingBottom ? `${style.paddingBottom}pt` : undefined,
    paddingLeft: style.paddingLeft ? `${style.paddingLeft}pt` : undefined,
    borderTop: borderValue(borders.top),
    borderRight: borderValue(borders.right),
    borderBottom: borderValue(borders.bottom),
    borderLeft: borderValue(borders.left),
  };
};
