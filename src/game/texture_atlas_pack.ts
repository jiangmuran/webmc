// Texture atlas packer. Given N square textures each with a fixed
// size, pack them into a single NxN power-of-two atlas with UV
// offsets per id.

export interface Texture {
  id: string;
  sizePx: number;
}

export interface AtlasEntry {
  id: string;
  u: number; // 0..1
  v: number;
  du: number;
  dv: number;
}

export interface Atlas {
  sizePx: number;
  entries: AtlasEntry[];
}

export function packAtlas(textures: Texture[]): Atlas {
  const count = textures.length;
  const cols = Math.ceil(Math.sqrt(count));
  const cell = Math.max(1, ...textures.map((t) => t.sizePx));
  let side = cols * cell;
  // round up to next power of 2
  let pow = 1;
  while (pow < side) pow *= 2;
  side = pow;
  const entries: AtlasEntry[] = textures.map((t, i) => {
    const cx = i % cols;
    const cy = Math.floor(i / cols);
    return {
      id: t.id,
      u: (cx * cell) / side,
      v: (cy * cell) / side,
      du: t.sizePx / side,
      dv: t.sizePx / side,
    };
  });
  return { sizePx: side, entries };
}

export function lookup(a: Atlas, id: string): AtlasEntry | null {
  return a.entries.find((e) => e.id === id) ?? null;
}
