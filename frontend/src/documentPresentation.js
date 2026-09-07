export const clampReaderZoom = (value) => Math.min(2.25, Math.max(1, value));

export const textOfBlock = (block = {}) => (block.spans || []).map((span) => span.text || "").join("").trim();

export const isImageBlock = (block = {}) => block.kind === "image" || block.kind === "image-group";

export const isFigureLabel = (block = {}) => block.kind === "paragraph"
  && !block.list
  && textOfBlock(block).length > 0
  && textOfBlock(block).length <= 140;

export const isCaptionBlock = (block = {}) => isFigureLabel(block) && block.style?.align === "center";

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
