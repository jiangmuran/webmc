// Stonecutter. Single input → many possible variant outputs. No fuel,
// no XP. Used for stone/cobble/deepslate/brick family conversions.

export interface Recipe {
  output: string;
  outputCount: number;
}

const TABLE: Record<string, Recipe[]> = {
  'webmc:stone': [
    { output: 'webmc:stone_bricks', outputCount: 1 },
    { output: 'webmc:stone_stairs', outputCount: 1 },
    { output: 'webmc:stone_slab', outputCount: 2 },
    { output: 'webmc:chiseled_stone_bricks', outputCount: 1 },
  ],
  'webmc:cobblestone': [
    { output: 'webmc:cobblestone_stairs', outputCount: 1 },
    { output: 'webmc:cobblestone_slab', outputCount: 2 },
    { output: 'webmc:cobblestone_wall', outputCount: 1 },
  ],
  'webmc:deepslate': [
    { output: 'webmc:deepslate_bricks', outputCount: 1 },
    { output: 'webmc:deepslate_slab', outputCount: 2 },
    { output: 'webmc:deepslate_stairs', outputCount: 1 },
    { output: 'webmc:deepslate_wall', outputCount: 1 },
  ],
  'webmc:sandstone': [
    { output: 'webmc:sandstone_stairs', outputCount: 1 },
    { output: 'webmc:sandstone_slab', outputCount: 2 },
    { output: 'webmc:chiseled_sandstone', outputCount: 1 },
    { output: 'webmc:cut_sandstone', outputCount: 1 },
  ],
};

export function outputsFor(input: string): Recipe[] {
  return TABLE[input] ?? [];
}

export interface CraftQuery {
  input: string;
  index: number; // selected recipe index
  count: number; // how many input items
}

export function craft(q: CraftQuery): { outputId: string; count: number } | null {
  const rec = TABLE[q.input]?.[q.index];
  if (!rec) return null;
  if (q.count <= 0) return null;
  return { outputId: rec.output, count: q.count * rec.outputCount };
}
