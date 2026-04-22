// Spawn egg: right-click on block face to spawn mob above that face.
// Right-click on mob with matching egg → spawn baby. Dispenser throws.

export interface SpawnEggUse {
  target: 'block' | 'mob' | 'air';
  targetMobType: string | null;
  eggMobType: string;
  isBabyAction: boolean;
}

export type SpawnResult =
  | { kind: 'spawned'; mobType: string }
  | { kind: 'spawned_baby'; mobType: string }
  | { kind: 'invalid' };

export function use(u: SpawnEggUse): SpawnResult {
  if (u.target === 'block') return { kind: 'spawned', mobType: u.eggMobType };
  if (u.target === 'mob' && u.targetMobType === u.eggMobType && u.isBabyAction) {
    return { kind: 'spawned_baby', mobType: u.eggMobType };
  }
  return { kind: 'invalid' };
}

export const SPAWN_EGG_MAX_STACK = 64;

export function dispenserThrowsAsEgg(): boolean {
  return true;
}
