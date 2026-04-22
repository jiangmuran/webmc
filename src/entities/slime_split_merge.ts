// Slime: splits on death into smaller slimes. Size 4 → 2-4×size 2,
// size 2 → 2-4×size 1. Size 1 drops slimeballs and does not split.

export interface SlimeState {
  size: 1 | 2 | 4;
}

export function splitOnDeath(
  s: SlimeState,
  rand: () => number,
): { children: SlimeState[]; slimeballs: number } {
  if (s.size === 1) return { children: [], slimeballs: 0 + Math.floor(rand() * 3) };
  const count = 2 + Math.floor(rand() * 3); // 2..4
  const childSize: 1 | 2 = s.size === 4 ? 2 : 1;
  const children: SlimeState[] = [];
  for (let i = 0; i < count; i++) children.push({ size: childSize });
  return { children, slimeballs: 0 };
}

export function damageDealt(s: SlimeState): number {
  if (s.size === 1) return 0;
  if (s.size === 2) return 2;
  return 4;
}

export function attackRange(s: SlimeState): number {
  return 0.5 * s.size;
}
