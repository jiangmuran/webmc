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

// Lightning on a copper block cleans it (strips 1 oxidation stage).
export const OX_TO_PREV: Record<string, string> = {
  'webmc:oxidized_copper': 'webmc:weathered_copper',
  'webmc:weathered_copper': 'webmc:exposed_copper',
  'webmc:exposed_copper': 'webmc:copper_block',
};

export function onCopperStrike(blockId: string): string | null {
  return OX_TO_PREV[blockId] ?? null;
}

// Sand → "lightning glass" is not vanilla. But lightning on sand
// vitrifies 1 block into... nothing (no change). Documented no-op.
export function sandStrikeEffect(): null {
  return null;
}

// Lightning creates a 4-block radius sphere of side effects.
export const SIDE_EFFECT_RADIUS = 4;
