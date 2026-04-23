export interface StonecutterRecipe {
  input: string;
  output: string;
  outputCount: number;
}

export const RECIPES: StonecutterRecipe[] = [
  { input: 'stone', output: 'stone_bricks', outputCount: 1 },
  { input: 'stone', output: 'stone_slab', outputCount: 2 },
  { input: 'stone', output: 'stone_stairs', outputCount: 1 },
  { input: 'cobblestone', output: 'cobblestone_wall', outputCount: 1 },
  { input: 'cobblestone', output: 'cobblestone_stairs', outputCount: 1 },
  { input: 'cobblestone', output: 'cobblestone_slab', outputCount: 2 },
  { input: 'sandstone', output: 'sandstone_stairs', outputCount: 1 },
  { input: 'sandstone', output: 'cut_sandstone', outputCount: 4 },
  { input: 'quartz_block', output: 'quartz_pillar', outputCount: 1 },
];

export function optionsFor(input: string): StonecutterRecipe[] {
  return RECIPES.filter((r) => r.input === input);
}

export function outputCountFor(input: string, output: string): number {
  const r = RECIPES.find((x) => x.input === input && x.output === output);
  return r?.outputCount ?? 0;
}
