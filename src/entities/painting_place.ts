// Painting placement. Random from motifs fitting the clear wall area
// (1x1, 1x2, 2x1, ..., 4x4). Breaking drops the painting item.

export type PaintingSize = '1x1' | '1x2' | '2x1' | '2x2' | '4x3' | '4x4';

const SIZE_WH: Record<PaintingSize, { w: number; h: number }> = {
  '1x1': { w: 1, h: 1 },
  '1x2': { w: 1, h: 2 },
  '2x1': { w: 2, h: 1 },
  '2x2': { w: 2, h: 2 },
  '4x3': { w: 4, h: 3 },
  '4x4': { w: 4, h: 4 },
};

const MOTIFS: { name: string; size: PaintingSize }[] = [
  { name: 'kebab', size: '1x1' },
  { name: 'aztec', size: '1x1' },
  { name: 'alban', size: '1x1' },
  { name: 'wasteland', size: '1x1' },
  { name: 'graham', size: '1x2' },
  { name: 'pool', size: '2x1' },
  { name: 'courbet', size: '2x1' },
  { name: 'sunset', size: '2x1' },
  { name: 'wanderer', size: '1x2' },
  { name: 'pointer', size: '4x4' },
  { name: 'pigscene', size: '4x4' },
  { name: 'burningskull', size: '4x4' },
  { name: 'skeleton', size: '4x3' },
  { name: 'donkeykong', size: '4x3' },
  { name: 'skullandroses', size: '2x2' },
];

export function fittingMotifs(maxW: number, maxH: number): { name: string; size: PaintingSize }[] {
  return MOTIFS.filter((m) => {
    const wh = SIZE_WH[m.size];
    return wh.w <= maxW && wh.h <= maxH;
  });
}

export interface PlaceQuery {
  maxW: number;
  maxH: number;
  rand: () => number;
}

export function pickPainting(q: PlaceQuery): { name: string; size: PaintingSize } | null {
  const list = fittingMotifs(q.maxW, q.maxH);
  if (list.length === 0) return null;
  return list[Math.floor(q.rand() * list.length)] ?? null;
}

export function sizeDims(s: PaintingSize): { w: number; h: number } {
  return SIZE_WH[s];
}
