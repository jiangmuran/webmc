// Texture atlas bin packer (simple shelf-pack). Inputs: list of
// rectangle sizes; output: (x,y) offsets + atlas width/height.

export interface Rect {
  id: string;
  w: number;
  h: number;
}

export interface PackedRect extends Rect {
  x: number;
  y: number;
}

export interface AtlasResult {
  atlasWidth: number;
  atlasHeight: number;
  placements: PackedRect[];
}

export function shelfPack(rects: Rect[], maxWidth: number): AtlasResult {
  const sorted = [...rects].sort((a, b) => b.h - a.h);
  let x = 0;
  let y = 0;
  let shelfHeight = 0;
  const placements: PackedRect[] = [];
  let atlasHeight = 0;
  for (const r of sorted) {
    if (x + r.w > maxWidth) {
      x = 0;
      y += shelfHeight;
      shelfHeight = 0;
    }
    placements.push({ ...r, x, y });
    x += r.w;
    if (r.h > shelfHeight) shelfHeight = r.h;
    if (y + shelfHeight > atlasHeight) atlasHeight = y + shelfHeight;
  }
  return { atlasWidth: maxWidth, atlasHeight, placements };
}
