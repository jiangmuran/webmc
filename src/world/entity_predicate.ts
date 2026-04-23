// Entity predicate used by advancements + loot.

export interface EntityPredicate {
  type?: string;
  nbt?: Record<string, unknown>;
  distanceMax?: number;
  location?: { y?: { min?: number; max?: number } };
  equipment?: { slot: 'mainhand' | 'offhand' | 'head' | 'chest' | 'legs' | 'feet'; itemId: string };
}

export interface EntitySnapshot {
  type: string;
  nbt: Record<string, unknown>;
  distance: number;
  y: number;
  equipment: Partial<Record<'mainhand' | 'offhand' | 'head' | 'chest' | 'legs' | 'feet', string>>;
}

export function matches(p: EntityPredicate, e: EntitySnapshot): boolean {
  if (p.type && p.type !== e.type) return false;
  if (p.distanceMax !== undefined && e.distance > p.distanceMax) return false;
  if (p.location?.y) {
    if (p.location.y.min !== undefined && e.y < p.location.y.min) return false;
    if (p.location.y.max !== undefined && e.y > p.location.y.max) return false;
  }
  if (p.equipment) {
    if (e.equipment[p.equipment.slot] !== p.equipment.itemId) return false;
  }
  return true;
}
