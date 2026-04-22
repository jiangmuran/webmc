// Overworld Y bounds: -64..319. Nether: 0..127. End: 0..255. Blocks
// outside these bounds are rejected; entities below fall into void.

export type Dim = 'overworld' | 'nether' | 'end';

const BOUNDS: Record<Dim, { min: number; max: number; voidBelow: number }> = {
  overworld: { min: -64, max: 319, voidBelow: -70 },
  nether: { min: 0, max: 127, voidBelow: -6 },
  end: { min: 0, max: 255, voidBelow: -6 },
};

export function minY(d: Dim): number {
  return BOUNDS[d].min;
}

export function maxY(d: Dim): number {
  return BOUNDS[d].max;
}

export function inBounds(d: Dim, y: number): boolean {
  const b = BOUNDS[d];
  return y >= b.min && y <= b.max;
}

export function inVoid(d: Dim, y: number): boolean {
  return y < BOUNDS[d].voidBelow;
}

export function clamp(d: Dim, y: number): number {
  const b = BOUNDS[d];
  return Math.max(b.min, Math.min(b.max, y));
}

// Bedrock layer pattern: the bottom ~5 levels in overworld have
// deterministic bedrock distribution.
export function isBedrockAt(
  d: Dim,
  y: number,
  rand: (x: number, y: number, z: number) => number,
  x: number,
  z: number,
): boolean {
  if (d !== 'overworld' && d !== 'nether') return false;
  const min = BOUNDS[d].min;
  if (y === min) return true;
  if (y === min + 1) return rand(x, y, z) < 0.75;
  if (y === min + 2) return rand(x, y, z) < 0.5;
  if (y === min + 3) return rand(x, y, z) < 0.25;
  return false;
}
