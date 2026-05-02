// Lightning strike effects on blocks: ignites grass/leaves/wood,
// turns sand into fulgurite? no — turns grass to path? Actually no.
// Real effects: ignites flammables, strikes lightning rods, charges
// creepers.

export interface StrikeQuery {
  groundBlockId: string;
  rand: () => number;
}

const IGNITABLE = new Set<string>([
  'webmc:oak_leaves',
  'webmc:dark_oak_leaves',
  'webmc:birch_leaves',
  'webmc:hay_block',
  'webmc:wool',
  'webmc:oak_planks',
]);

export function ignitesBlock(q: StrikeQuery): boolean {
  return IGNITABLE.has(q.groundBlockId);
}

// Wiki (minecraft.wiki/w/Oxidation): "A lightning bolt striking a
// non-waxed copper block removes all oxidation from the block, and
// may also deoxidize randomly selected copper blocks nearby." So
// lightning resets to FULLY un-oxidized (`webmc:copper_block`),
// not back one stage. Old map peeled just 1 layer per strike —
// wiki strips ALL layers in a single bolt. Sibling
// copper_oxidation.lightningStrike() already does the full reset;
// this lookup map now matches.
export const OX_TO_REGULAR: Record<string, string> = {
  'webmc:oxidized_copper': 'webmc:copper_block',
  'webmc:weathered_copper': 'webmc:copper_block',
  'webmc:exposed_copper': 'webmc:copper_block',
};
/** @deprecated kept for back-compat; resolves to the same full-reset map. */
export const OX_TO_PREV = OX_TO_REGULAR;

export function onCopperStrike(blockId: string): string | null {
  return OX_TO_REGULAR[blockId] ?? null;
}

// Sand → "lightning glass" is not vanilla. But lightning on sand
// vitrifies 1 block into... nothing (no change). Documented no-op.
export function sandStrikeEffect(): null {
  return null;
}

// Lightning creates a 4-block radius sphere of side effects.
export const SIDE_EFFECT_RADIUS = 4;
