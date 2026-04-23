export interface AtlasInput {
  id: string;
  width: number;
  height: number;
}

export interface AtlasPlacement {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export function packShelves(
  inputs: AtlasInput[],
  atlasWidth: number,
): {
  placements: AtlasPlacement[];
  totalHeight: number;
} {
  const sorted = [...inputs].sort((a, b) => b.height - a.height);
  const placements: AtlasPlacement[] = [];
  let cursorX = 0;
  let cursorY = 0;
  let shelfHeight = 0;
  for (const t of sorted) {
    if (cursorX + t.width > atlasWidth) {
      cursorY += shelfHeight;
      cursorX = 0;
      shelfHeight = 0;
    }
    placements.push({ id: t.id, x: cursorX, y: cursorY, w: t.width, h: t.height });
    cursorX += t.width;
    shelfHeight = Math.max(shelfHeight, t.height);
  }
  return { placements, totalHeight: cursorY + shelfHeight };
}
