export interface SweepInput {
  sweepingEdgeLevel: number;
  baseDamage: number;
  onGround: boolean;
  sprinting: boolean;
  sweepingArea: number;
}

export function sweepDamage(i: SweepInput): number {
  if (!i.onGround || i.sprinting) return 0;
  // Wiki: sweep deals 1 damage flat without sweeping_edge, plus
  // (level / (level+1)) × base damage with the enchant. Was inverted
  // (1/(level+1)), which gave MORE damage at no-enchant and LESS at
  // higher levels — exact opposite of wiki.
  const factor = i.sweepingEdgeLevel === 0 ? 0 : i.sweepingEdgeLevel / (i.sweepingEdgeLevel + 1);
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
