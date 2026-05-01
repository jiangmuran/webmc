export type AxolotlAction = 'tropical_fish_bucket' | 'water_breathe_regen' | 'idle';

const VALID_FOODS = new Set<string>(['tropical_fish_bucket']);

export function canFeed(itemId: string): boolean {
  return VALID_FOODS.has(itemId);
}

export const REGEN_DURATION_ON_PLAYER_REVIVE = 20 * 100;
export const EFFECT_AMPLIFIER = 0;

// Wiki (minecraft.wiki/w/Axolotl#Behavior): "when an axolotl helps
// the player kill a hostile mob, the player receives the
// Regeneration I effect for 100 seconds and any Mining Fatigue
// effects are removed." Just Regeneration I — Resistance was a
// previous misread of the wiki and isn't part of the buff. Mining
// Fatigue is cleared (see clearsOnAttack), not added.
export function grantsRegenOnAttack(): { id: string; duration: number; amplifier: number }[] {
  return [
    { id: 'regeneration', duration: REGEN_DURATION_ON_PLAYER_REVIVE, amplifier: EFFECT_AMPLIFIER },
  ];
}

// Effects CLEARED from the player when an axolotl assists in combat.
// Wiki documents Mining Fatigue specifically.
export function clearsOnAttack(): readonly string[] {
  return ['mining_fatigue'];
}

// Wiki (minecraft.wiki/w/Axolotl#Behavior): play-dead duration is a
// flat 10 seconds (200 ticks) — no randomness in vanilla. Sibling
// modules axolotl_play_dead.ts (10_000 ms) and axolotl_revive.ts
// (10 seconds) both use the fixed value. Old `200 + rand * 100`
// returned 10..15s, ~25% over wiki on average. The rng parameter is
// kept for API back-compat but ignored.
export const PLAY_DEAD_TICKS = 200;

export function playDeadDuration(_rng: () => number): number {
  void _rng;
  return PLAY_DEAD_TICKS;
}
