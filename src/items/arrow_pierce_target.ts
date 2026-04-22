// Piercing enchant (crossbow only). An arrow with Piercing N can pass
// through N entities before stopping. Tracks already-hit entities to
// avoid double-damage on re-hit.

export interface PiercingTracker {
  piercingLevel: number;
  alreadyHitIds: Set<number>;
}

export function makePiercingTracker(level: number): PiercingTracker {
  return { piercingLevel: Math.max(0, Math.min(4, level)), alreadyHitIds: new Set() };
}

export interface OnHitQuery {
  tracker: PiercingTracker;
  targetId: number;
}

export type OnHitResult =
  | { kind: 'damage_and_continue' }
  | { kind: 'damage_and_stop' }
  | { kind: 'skip_already_hit' };

export function onEntityHit(q: OnHitQuery): OnHitResult {
  if (q.tracker.alreadyHitIds.has(q.targetId)) {
    return { kind: 'skip_already_hit' };
  }
  q.tracker.alreadyHitIds.add(q.targetId);
  if (q.tracker.alreadyHitIds.size > q.tracker.piercingLevel) {
    return { kind: 'damage_and_stop' };
  }
  return { kind: 'damage_and_continue' };
}

// Piercing arrows can't be picked up normally because they're fired
// from a crossbow; that's enforced elsewhere via arrow_pickup.ts.
export function piercingArrowCount(piercingLevel: number): number {
  // number of entities the arrow can damage (level+1: 1 base + N extras)
  return 1 + Math.max(0, Math.min(4, piercingLevel));
}

// Reset tracker between shots.
export function resetTracker(t: PiercingTracker): void {
  t.alreadyHitIds.clear();
}
