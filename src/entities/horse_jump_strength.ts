export const MIN_JUMP = 0.4;
export const MAX_JUMP = 1.0;

export function rollJumpStrength(rng: () => number): number {
  const raw = rng() * 0.2 + rng() * 0.2 + rng() * 0.2;
  return MIN_JUMP + raw;
}

export function jumpHeightBlocks(strength: number): number {
  const s = Math.max(MIN_JUMP, Math.min(MAX_JUMP, strength));
  const v = s * s * s * 10;
  return v;
}

export function canClearHeight(strength: number, blocks: number): boolean {
  return jumpHeightBlocks(strength) >= blocks;
}
