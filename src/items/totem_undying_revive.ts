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

export function grantsEffects(): TotemEffects {
  return {
    reviveHealth: 1,
    fireResistance: 800,
    absorption: 100,
    regen: 900,
  };
}
