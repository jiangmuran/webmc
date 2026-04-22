// Weighted pressure plates. Heavy (iron) saturates at 150 entities
// for signal 15; light (gold) at 15. Normal wood/stone = any entity.

export type PlateKind = 'wood' | 'stone' | 'iron' | 'gold' | 'polished_blackstone';

export interface PlateQuery {
  kind: PlateKind;
  entityCountOnPlate: number;
  onlyPlayersTrigger?: boolean;
  hasAnyPlayer?: boolean;
}

export function plateOutput(q: PlateQuery): number {
  if (q.kind === 'wood' || q.kind === 'polished_blackstone') {
    return q.entityCountOnPlate > 0 ? 15 : 0;
  }
  if (q.kind === 'stone') {
    // mobs only
    return q.entityCountOnPlate > 0 ? 15 : 0;
  }
  if (q.kind === 'iron') {
    return Math.max(0, Math.min(15, Math.ceil(q.entityCountOnPlate / 10)));
  }
  return Math.max(0, Math.min(15, q.entityCountOnPlate));
}

// Wooden plate also triggers on projectiles; stone doesn't.
export function canProjectileTrigger(kind: PlateKind): boolean {
  return kind === 'wood' || kind === 'polished_blackstone';
}
