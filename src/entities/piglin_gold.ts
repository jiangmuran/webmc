// Piglins attracted to gold. Dropping a gold ingot near piglins causes
// them to pick it up + inspect for 6s, possibly triggering a bartering
// exchange. Wearing gold armor prevents piglin aggression.

export interface PiglinGoldState {
  playerWearingGold: boolean;
  hostileOverride: boolean;
}

export function makePiglinGoldState(): PiglinGoldState {
  return { playerWearingGold: false, hostileOverride: false };
}

// Tracks what items piglins treat as "gold": bartering input, gold items
// for calm-down, wearing-gold-armor for neutrality.
export function isGoldArmor(itemName: string): boolean {
  return (
    itemName === 'webmc:golden_helmet' ||
    itemName === 'webmc:golden_chestplate' ||
    itemName === 'webmc:golden_leggings' ||
    itemName === 'webmc:golden_boots'
  );
}

export function wearingGoldArmor(equipped: readonly string[]): boolean {
  return equipped.some(isGoldArmor);
}

// Piglin hostility rule: hostile unless (a) wearing gold armor, or (b)
// in a zombified_piglin situation (not modeled here).
export function piglinShouldAggro(state: PiglinGoldState, equipped: readonly string[]): boolean {
  if (state.hostileOverride) return true;
  state.playerWearingGold = wearingGoldArmor(equipped);
  return !state.playerWearingGold;
}

// Opening a chest / shulker box / barrel near piglins provokes them.
export function onChestOpenedNearPiglin(state: PiglinGoldState): void {
  state.hostileOverride = true;
}

export function clearHostilityAfter(state: PiglinGoldState, sec: number): void {
  void sec;
  state.hostileOverride = false;
}
