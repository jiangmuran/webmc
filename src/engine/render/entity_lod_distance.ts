export interface EntityLodInput {
  distance: number;
  entityType: 'hostile' | 'passive' | 'item_entity' | 'player' | 'projectile' | 'particle';
}

export type EntityDetail = 'full_model' | 'low_poly' | 'billboard' | 'culled';

export function detailFor(i: EntityLodInput): EntityDetail {
  const thresholds = i.entityType === 'player' ? [64, 128, 256] : [32, 64, 128];
  const [full, low, billboard] = thresholds;
  if (full !== undefined && i.distance <= full) return 'full_model';
  if (low !== undefined && i.distance <= low) return 'low_poly';
  if (billboard !== undefined && i.distance <= billboard) return 'billboard';
  return 'culled';
}

export function shouldAnimate(detail: EntityDetail): boolean {
  return detail === 'full_model' || detail === 'low_poly';
}
