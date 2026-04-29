// Totem of undying. Held in main or off hand, consumed when damage
// would kill the player — restores 1 HP and applies Regen II 40s +
// Fire Resist 40s + Absorption II 5s. Returns true on activation so
// caller can play visual/audio + consume the totem. Wiki:
// minecraft.wiki/w/Totem_of_Undying.

export interface TotemHolder {
  mainHand: { name: string } | null;
  offHand: { name: string } | null;
}

export interface TotemResult {
  activated: boolean;
  consumedHand: 'main' | 'off' | null;
  appliedEffects: readonly { id: string; amplifier: number; durationSec: number }[];
}

const TOTEM_NAME = 'webmc:totem_of_undying';

export function tryTotem(holder: TotemHolder): TotemResult {
  const mainIsTotem = holder.mainHand?.name === TOTEM_NAME;
  const offIsTotem = holder.offHand?.name === TOTEM_NAME;
  if (!mainIsTotem && !offIsTotem) {
    return { activated: false, consumedHand: null, appliedEffects: [] };
  }
  // Wiki: off-hand is consumed first when both hands hold a totem.
  // Old logic prioritized main-hand — opposite of wiki and the
  // sibling totem_offhand_priority module.
  const consumedHand: 'main' | 'off' = offIsTotem ? 'off' : 'main';
  if (consumedHand === 'main') holder.mainHand = null;
  else holder.offHand = null;
  return {
    activated: true,
    consumedHand,
    appliedEffects: [
      // Wiki: Regeneration II for 40s (not 45). Old constant was off
      // by 5 seconds.
      { id: 'regeneration', amplifier: 1, durationSec: 40 },
      { id: 'fire_resistance', amplifier: 0, durationSec: 40 },
      { id: 'absorption', amplifier: 1, durationSec: 5 },
    ],
  };
}
