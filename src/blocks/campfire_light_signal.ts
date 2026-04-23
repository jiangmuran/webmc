export type CampfireKind = 'campfire' | 'soul_campfire';

export const LIGHT_REGULAR = 15;
export const LIGHT_SOUL = 10;

export function lightLevel(kind: CampfireKind, lit: boolean): number {
  if (!lit) return 0;
  return kind === 'campfire' ? LIGHT_REGULAR : LIGHT_SOUL;
}

export function smokeColumnDistance(kind: CampfireKind, hayUnderneath: boolean): number {
  const base = kind === 'campfire' ? 10 : 12;
  return hayUnderneath ? base * 2 : base;
}

export function damageToEntities(kind: CampfireKind, lit: boolean): number {
  if (!lit) return 0;
  return kind === 'soul_campfire' ? 2 : 1;
}
