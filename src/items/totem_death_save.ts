// Totem of Undying death save. When a player would take lethal damage
// while holding a totem in main- or off-hand, the totem is consumed:
// the player is set to 1 HP + Regeneration II (45s) + Fire Resistance
// (40s) + Absorption II (5s).
//
// Wiki (minecraft.wiki/w/Totem_of_Undying) Infobox:
//   Regeneration II (0:45) — 45 s
//   Fire Resistance I (0:40)
//   Absorption II (0:05)
// An earlier comment claimed wiki said 40 s for regen; that was a
// misread of the Infobox.

export interface TotemDeathQuery {
  heldMainhand: string;
  heldOffhand: string;
  damageAboutToTake: number;
  currentHealth: number;
}

export interface TotemSaveResult {
  triggered: boolean;
  consumedSlot: 'mainhand' | 'offhand' | null;
  setHealthTo: number;
  appliedEffects: readonly { id: string; amplifier: number; durationSec: number }[];
}

const TOTEM_ID = 'webmc:totem_of_undying';

export function applyTotem(q: TotemDeathQuery): TotemSaveResult {
  const incoming = q.damageAboutToTake;
  if (incoming < q.currentHealth) {
    return {
      triggered: false,
      consumedSlot: null,
      setHealthTo: q.currentHealth,
      appliedEffects: [],
    };
  }
  // Wiki (minecraft.wiki/w/Totem_of_Undying): off-hand is checked
  // FIRST when both hands hold a totem. Old code checked mainhand
  // first, inconsistent with totem_offhand_priority.ts and wiki.
  let slot: 'mainhand' | 'offhand' | null = null;
  if (q.heldOffhand === TOTEM_ID) slot = 'offhand';
  else if (q.heldMainhand === TOTEM_ID) slot = 'mainhand';
  if (slot === null) {
    return {
      triggered: false,
      consumedSlot: null,
      setHealthTo: Math.max(0, q.currentHealth - incoming),
      appliedEffects: [],
    };
  }
  return {
    triggered: true,
    consumedSlot: slot,
    setHealthTo: 1,
    appliedEffects: [
      { id: 'regeneration', amplifier: 1, durationSec: 45 },
      { id: 'fire_resistance', amplifier: 0, durationSec: 40 },
      { id: 'absorption', amplifier: 1, durationSec: 5 },
    ],
  };
}

// Advancement: "Postmortal" — trigger a totem death save at least once.
export const TOTEM_ADVANCEMENT_ID = 'adventure/totem_of_undying';
