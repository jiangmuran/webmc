// Slime splitting. On death, big slimes split into 2-4 smaller
// slimes. Sizes 1 (tiny), 2 (small), 4 (big). Tiny slimes deal no
// damage and drop slimeballs only.

export interface Slime {
  size: 1 | 2 | 4;
  hp: number;
}

export const MAX_CHILDREN = 4;

export function childSizeOf(size: 1 | 2 | 4): 1 | 2 | null {
  if (size === 4) return 2;
  if (size === 2) return 1;
  return null;
}

export function onDeathSplit(s: Slime, rand: () => number): Slime[] {
  const child = childSizeOf(s.size);
  if (child === null) return [];
  const count = 2 + Math.floor(rand() * (MAX_CHILDREN - 1));
  const out: Slime[] = [];
  for (let i = 0; i < count; i++) out.push({ size: child, hp: hpFor(child) });
  return out;
}

export function hpFor(size: 1 | 2 | 4): number {
  return size === 4 ? 16 : size === 2 ? 4 : 1;
}

export function attackDamageFor(size: 1 | 2 | 4): number {
  return size === 4 ? 4 : size === 2 ? 2 : 0;
}

// Only tiny slimes drop slimeballs (0-2).
export function slimeballDrop(size: 1 | 2 | 4, rand: () => number): number {
  return size === 1 ? Math.floor(rand() * 3) : 0;
}
