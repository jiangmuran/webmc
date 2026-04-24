export interface NameplateInput {
  customName?: string;
  alwaysVisible: boolean;
  distance: number;
  sneakingTarget: boolean;
  crouchingViewer: boolean;
  entityType: 'player' | 'mob' | 'item' | 'armor_stand';
}

export const MAX_NAME_DISTANCE = 64;

export function shouldRenderName(i: NameplateInput): boolean {
  if (i.customName === undefined && i.entityType !== 'player') return false;
  if (i.distance > MAX_NAME_DISTANCE) return false;
  if (i.sneakingTarget && !i.alwaysVisible) return false;
  return true;
}

export function nameOpacity(distance: number): number {
  if (distance < MAX_NAME_DISTANCE * 0.8) return 1;
  return Math.max(0, 1 - (distance - MAX_NAME_DISTANCE * 0.8) / (MAX_NAME_DISTANCE * 0.2));
}
