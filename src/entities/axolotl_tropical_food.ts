export type AxolotlAction = 'tropical_fish_bucket' | 'water_breathe_regen' | 'idle';

const VALID_FOODS = new Set<string>(['tropical_fish_bucket']);

export function canFeed(itemId: string): boolean {
  return VALID_FOODS.has(itemId);
}

export const REGEN_DURATION_ON_PLAYER_REVIVE = 20 * 100;
export const EFFECT_AMPLIFIER = 0;

// Wiki (minecraft.wiki/w/Axolotl#Behavior): when an axolotl helps a
// player kill a hostile, the player gains Regeneration I + Resistance
// I and Mining Fatigue is REMOVED. Old code returned mining_fatigue
// as an effect to APPLY — opposite of wiki. Now grants regen +
// resistance; callers should clear mining_fatigue via clearsOnAttack.
export function grantsRegenOnAttack(): { id: string; duration: number; amplifier: number }[] {
  return [
    { id: 'regeneration', duration: REGEN_DURATION_ON_PLAYER_REVIVE, amplifier: EFFECT_AMPLIFIER },
    { id: 'resistance', duration: REGEN_DURATION_ON_PLAYER_REVIVE, amplifier: EFFECT_AMPLIFIER },
  ];
}

// Effects CLEARED from the player when an axolotl assists in combat.
// Wiki documents Mining Fatigue specifically.
export function clearsOnAttack(): readonly string[] {
  return ['mining_fatigue'];
}

export function playDeadDuration(rng: () => number): number {
  return 200 + Math.floor(rng() * 100);
}
