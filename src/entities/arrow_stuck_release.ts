export interface ArrowEntity {
  stuckTicks: number;
  pickupState: 'creative_only' | 'allowed' | 'disallowed';
  shooter: string;
}

export const DESPAWN_TICKS = 1200;

export function isDespawning(a: ArrowEntity): boolean {
  return a.stuckTicks >= DESPAWN_TICKS;
}

export function canBePickedUp(a: ArrowEntity, playerIsCreative: boolean): boolean {
  if (a.pickupState === 'disallowed') return false;
  if (a.pickupState === 'creative_only') return playerIsCreative;
  return true;
}

export function visibleInCreative(): boolean {
  return true;
}
