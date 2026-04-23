export type MagmaSize = 1 | 2 | 4;

export function splitSize(size: MagmaSize): MagmaSize | undefined {
  if (size === 4) return 2;
  if (size === 2) return 1;
  return undefined;
}

export function splitCount(size: MagmaSize, rng: () => number): number {
  if (size === 1) return 0;
  return 2 + Math.floor(rng() * 3);
}

export function onKill(size: MagmaSize, rng: () => number): { newSize?: MagmaSize; count: number } {
  const newSize = splitSize(size);
  if (newSize === undefined) return { count: 0 };
  return { newSize, count: splitCount(size, rng) };
}

export function maxHealth(size: MagmaSize): number {
  return size * size;
}
