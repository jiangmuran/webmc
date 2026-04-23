// Stonecutter produces 1 output per 1 input. Same family variants
// (stairs, slabs, walls). 1 input → 1..2 outputs depending on form.

export const STONECUTTER_INPUTS: Record<string, string[]> = {
  stone: ['stone_stairs', 'stone_slab', 'cobblestone', 'stone_bricks', 'smooth_stone'],
  cobblestone: ['cobblestone_stairs', 'cobblestone_slab', 'cobblestone_wall'],
  sandstone: [
    'sandstone_stairs',
    'sandstone_slab',
    'sandstone_wall',
    'chiseled_sandstone',
    'cut_sandstone',
  ],
  nether_bricks: ['nether_brick_stairs', 'nether_brick_slab', 'nether_brick_wall'],
  prismarine: ['prismarine_stairs', 'prismarine_slab', 'prismarine_wall', 'prismarine_bricks'],
};

export function recipesFor(input: string): string[] {
  return STONECUTTER_INPUTS[input] ?? [];
}

export function yieldCount(output: string): number {
  return output.endsWith('_slab') ? 2 : 1;
}

export function canCut(input: string, output: string): boolean {
  return recipesFor(input).includes(output);
}
