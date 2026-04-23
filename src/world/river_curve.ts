// River path generation. A river is a curve across a chunk where water
// carves a valley in the heightmap. Simplified: sample a sin-like path.

export function riverDepressionAt(x: number, z: number, seed: number): number {
  const phase = ((seed & 0xff) / 255) * Math.PI * 2;
  const line = Math.sin(x * 0.01 + phase) * 50; // target z for river
  const d = Math.abs(z - line);
  if (d > 8) return 0;
  return 1 - d / 8;
}

export function isRiver(x: number, z: number, seed: number): boolean {
  return riverDepressionAt(x, z, seed) > 0.6;
}

export const RIVER_DEPRESSION_MAX_DEPTH = 10;

export function depressionDepth(strength: number): number {
  return Math.floor(strength * RIVER_DEPRESSION_MAX_DEPTH);
}
