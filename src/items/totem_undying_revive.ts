export interface PlayerDyingInput {
  heldMainHand?: string;
  heldOffhand?: string;
  currentHealth: number;
  incomingDamage: number;
}

export function totemSaves(i: PlayerDyingInput): {
  consumedHand: 'main' | 'off' | null;
} {
  if (i.currentHealth - i.incomingDamage > 0) return { consumedHand: null };
  if (i.heldOffhand === 'totem_of_undying') return { consumedHand: 'off' };
  if (i.heldMainHand === 'totem_of_undying') return { consumedHand: 'main' };
  return { consumedHand: null };
}

export interface TotemEffects {
  reviveHealth: number;
  fireResistance: number;
  absorption: number;
  regen: number;
}

// Wiki (minecraft.wiki/w/Totem_of_Undying):
//   Regeneration II for 0:45 (45 s = 900 ticks)
//   Fire Resistance I for 0:40 (40 s = 800 ticks)
//   Absorption II for 0:05 (5 s = 100 ticks)
//
// An earlier change rounded regen down to 800 ticks (40 s) citing
// the wiki — that was a misread; the wiki Infobox explicitly shows
// Regeneration II (0:45). Reverting to 900.
export function grantsEffects(): TotemEffects {
  return {
    reviveHealth: 1,
    fireResistance: 800,
    absorption: 100,
    regen: 900,
  };
}
