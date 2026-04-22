// Charged creeper. Lightning strike on a normal creeper converts it to
// charged → explosion power doubles (4→8) + mob-skull drops when it kills
// another mob.

export interface ChargedCreeperState {
  charged: boolean;
}

export function makeChargedCreeper(): ChargedCreeperState {
  return { charged: false };
}

export function electrify(state: ChargedCreeperState): boolean {
  if (state.charged) return false;
  state.charged = true;
  return true;
}

export function explosionPower(state: ChargedCreeperState): number {
  return state.charged ? 8 : 4;
}

// Mob skulls dropped when charged creeper kills another mob.
const MOB_TO_SKULL: Record<string, string> = {
  zombie: 'webmc:zombie_head',
  skeleton: 'webmc:skeleton_skull',
  wither_skeleton: 'webmc:wither_skeleton_skull',
  creeper: 'webmc:creeper_head',
  piglin: 'webmc:piglin_head',
};

export function killDrop(state: ChargedCreeperState, victimKind: string): string | null {
  if (!state.charged) return null;
  return MOB_TO_SKULL[victimKind] ?? null;
}
