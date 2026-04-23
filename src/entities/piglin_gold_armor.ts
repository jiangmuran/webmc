// Piglins don't attack players wearing any gold armor piece (except
// when the player opens chests / mines gold ore).

export interface PiglinAggroCtx {
  playerWearingGold: boolean;
  playerMinedGold: boolean;
  playerOpenedChest: boolean;
  playerAttackedPiglin: boolean;
}

export function isHostileToPlayer(c: PiglinAggroCtx): boolean {
  if (c.playerAttackedPiglin) return true;
  if (c.playerMinedGold || c.playerOpenedChest) return true;
  return !c.playerWearingGold;
}

export function acceptsBarter(heldItem: string): boolean {
  return heldItem === 'gold_ingot';
}

export function likedEquipment(armor: string): boolean {
  return armor.startsWith('gold_') || armor.startsWith('golden_');
}

export function dropsGoldIngotsOnKill(): boolean {
  return true;
}
