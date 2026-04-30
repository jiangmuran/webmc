// Charged creeper. Lightning strike on a normal creeper converts it to
// charged → explosion power doubles (3→6 per wiki) + mob-skull drops
// when it kills another mob.

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

// Wiki: normal creeper explosion power 3, charged 6 (not 4/8). The
// other creeper module (creeper_explosion.ts) had the right values.
export function explosionPower(state: ChargedCreeperState): number {
  return state.charged ? 6 : 3;
}

// Mob skulls dropped when charged creeper kills another mob.
// Wiki (minecraft.wiki/w/Head#Mob_loot): "The following heads drop
// when the corresponding mob is killed by a charged creeper's
// explosion: Skeleton skull, Zombie head, Creeper head, Piglin head,
// Wither skeleton skull." Bogged is NOT in the wiki's drop list and
// no "bogged_skull" item exists in vanilla — the prior entry was
// fabricated. Dragon/player/wither heads are also explicitly
// excluded by MC-132933 (WAI), so they're not added.
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
