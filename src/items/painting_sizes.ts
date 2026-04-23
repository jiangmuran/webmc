export interface PaintingSize {
  id: string;
  w: number;
  h: number;
}

export const SIZES: PaintingSize[] = [
  { id: 'kebab', w: 1, h: 1 },
  { id: 'aztec', w: 1, h: 1 },
  { id: 'wanderer', w: 1, h: 2 },
  { id: 'graham', w: 1, h: 2 },
  { id: 'pool', w: 2, h: 1 },
  { id: 'sunset', w: 2, h: 1 },
  { id: 'wasteland', w: 1, h: 1 },
  { id: 'fighters', w: 4, h: 2 },
  { id: 'donkey_kong', w: 4, h: 3 },
  { id: 'pigscene', w: 4, h: 4 },
];

export function fitsInSpace(size: PaintingSize, availW: number, availH: number): boolean {
  return size.w <= availW && size.h <= availH;
}

export function randomSizeFitting(availW: number, availH: number, rng: () => number): PaintingSize | undefined {
  const options = SIZES.filter((s) => fitsInSpace(s, availW, availH));
  if (options.length === 0) return undefined;
  return options[Math.floor(rng() * options.length)];
}
