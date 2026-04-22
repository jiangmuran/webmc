// Stonecutter — cut stone-family blocks into 4 variants without losing
// material: slab (×2), stairs (×1), wall (×1), chiseled (×1). Pure —
// caller consumes 1 input per cut.

export interface StonecutterRecipe {
  input: string;
  output: string;
  count: number;
}

export const STONECUTTER_RECIPES: readonly StonecutterRecipe[] = [
  // Stone family.
  { input: 'webmc:stone', output: 'webmc:stone_slab', count: 2 },
  { input: 'webmc:stone', output: 'webmc:stone_stairs', count: 1 },
  { input: 'webmc:stone', output: 'webmc:stone_wall', count: 1 },
  { input: 'webmc:stone', output: 'webmc:chiseled_stone_bricks', count: 1 },
  { input: 'webmc:cobblestone', output: 'webmc:cobblestone_slab', count: 2 },
  { input: 'webmc:cobblestone', output: 'webmc:cobblestone_stairs', count: 1 },
  { input: 'webmc:cobblestone', output: 'webmc:cobblestone_wall', count: 1 },
  // Sandstone.
  { input: 'webmc:sandstone', output: 'webmc:sandstone_slab', count: 2 },
  { input: 'webmc:sandstone', output: 'webmc:sandstone_stairs', count: 1 },
  { input: 'webmc:sandstone', output: 'webmc:chiseled_sandstone', count: 1 },
  { input: 'webmc:sandstone', output: 'webmc:cut_sandstone', count: 1 },
  // Deepslate.
  { input: 'webmc:deepslate', output: 'webmc:polished_deepslate', count: 1 },
  { input: 'webmc:deepslate', output: 'webmc:deepslate_slab', count: 2 },
  { input: 'webmc:deepslate', output: 'webmc:deepslate_wall', count: 1 },
  // Copper family.
  { input: 'webmc:copper_block', output: 'webmc:cut_copper', count: 4 },
  { input: 'webmc:copper_block', output: 'webmc:cut_copper_stairs', count: 1 },
  // Nether brick.
  { input: 'webmc:nether_brick', output: 'webmc:nether_brick_slab', count: 2 },
  { input: 'webmc:nether_brick', output: 'webmc:nether_brick_wall', count: 1 },
  // Purpur.
  { input: 'webmc:purpur_block', output: 'webmc:purpur_slab', count: 2 },
  { input: 'webmc:purpur_block', output: 'webmc:purpur_pillar', count: 1 },
  // Quartz.
  { input: 'webmc:quartz_block', output: 'webmc:quartz_slab', count: 2 },
  { input: 'webmc:quartz_block', output: 'webmc:smooth_quartz', count: 1 },
];

export function outputsFor(input: string): readonly StonecutterRecipe[] {
  return STONECUTTER_RECIPES.filter((r) => r.input === input);
}

export function cut(input: string, output: string): StonecutterRecipe | null {
  for (const r of STONECUTTER_RECIPES) {
    if (r.input === input && r.output === output) return r;
  }
  return null;
}
