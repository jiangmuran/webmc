export interface SweepInput {
  sweepingEdgeLevel: number;
  baseDamage: number;
  onGround: boolean;
  sprinting: boolean;
  sweepingArea: number;
}

export function sweepDamage(i: SweepInput): number {
  if (!i.onGround || i.sprinting) return 0;
  const factor = 1 / (i.sweepingEdgeLevel + 1);
  return 1 + i.baseDamage * factor;
}

export function sweepRadius(): number {
  return 1;
}

export function entitiesInSweep<T extends { x: number; z: number; id: string }>(
  playerX: number,
  playerZ: number,
  candidates: readonly T[],
): readonly T[] {
  return candidates.filter((e) => Math.hypot(e.x - playerX, e.z - playerZ) <= sweepRadius());
}
