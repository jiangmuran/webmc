export interface StonecutterRecipe {
  input: string;
  output: string;
  count: number;
}

const RECIPES: readonly StonecutterRecipe[] = [
  { input: 'stone', output: 'stone_slab', count: 2 },
  { input: 'stone', output: 'stone_stairs', count: 1 },
  { input: 'stone', output: 'stone_button', count: 1 },
  { input: 'stone', output: 'chiseled_stone_bricks', count: 1 },
  { input: 'cobblestone', output: 'cobblestone_slab', count: 2 },
  { input: 'cobblestone', output: 'cobblestone_stairs', count: 1 },
  { input: 'cobblestone', output: 'cobblestone_wall', count: 1 },
  { input: 'oak_planks', output: 'oak_slab', count: 2 },
  { input: 'oak_planks', output: 'oak_stairs', count: 1 },
  { input: 'oak_planks', output: 'oak_fence', count: 1 },
];

export function recipesFor(input: string): readonly StonecutterRecipe[] {
  return RECIPES.filter((r) => r.input === input);
}

export function cut(
  input: string,
  output: string,
  inputCount: number,
): { output: string; count: number } | undefined {
  const r = RECIPES.find((x) => x.input === input && x.output === output);
  if (r === undefined) return undefined;
  return { output: r.output, count: r.count * inputCount };
}
