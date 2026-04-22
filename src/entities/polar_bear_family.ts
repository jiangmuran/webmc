// Polar bears defend cubs. If a player attacks one, all adjacent adult
// polar bears become hostile (revenge). Cubs are passive.

export interface PolarBear {
  id: number;
  isCub: boolean;
  provoked: boolean;
}

export interface AttackQuery {
  attackerId: number;
  targetBearId: number;
  bears: readonly PolarBear[];
  revengeRadiusCheck: (a: PolarBear, b: PolarBear) => boolean;
}

// Returns the set of bears that flip to hostile after the attack.
export function onPolarBearAttacked(q: AttackQuery): readonly number[] {
  const attackedBear = q.bears.find((b) => b.id === q.targetBearId);
  if (!attackedBear) return [];
  if (attackedBear.isCub) {
    // Attacking cub makes every adult in range hostile.
    return q.bears
      .filter((b) => !b.isCub && q.revengeRadiusCheck(b, attackedBear))
      .map((b) => b.id);
  }
  // Attacking an adult directly only provokes itself + adults in pack.
  return q.bears.filter((b) => !b.isCub && q.revengeRadiusCheck(b, attackedBear)).map((b) => b.id);
}

export function provoke(bears: readonly PolarBear[], ids: readonly number[]): void {
  for (const b of bears) if (ids.includes(b.id)) b.provoked = true;
}
