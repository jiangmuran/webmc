export interface CombatTag {
  taggedAtTick: number;
  attackerId: string;
  currentTick: number;
}

export const COMBAT_TAG_TICKS = 200;

export function inCombat(t: CombatTag): boolean {
  return t.currentTick - t.taggedAtTick < COMBAT_TAG_TICKS;
}

export function preventsLogout(t: CombatTag): boolean {
  return inCombat(t);
}

export function attributeKillOnLogout(t: CombatTag): string | undefined {
  return inCombat(t) ? t.attackerId : undefined;
}
