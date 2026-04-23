// Nugget ↔ ingot ↔ block craft conversions. 9 nuggets = 1 ingot;
// 9 ingots = 1 block (reversible).

export type Tier = 'nugget' | 'ingot' | 'block';

export function toIngot(nuggets: number): { ingots: number; remainder: number } {
  return { ingots: Math.floor(nuggets / 9), remainder: nuggets % 9 };
}

export function toBlock(ingots: number): { blocks: number; remainder: number } {
  return { blocks: Math.floor(ingots / 9), remainder: ingots % 9 };
}

export function toNuggets(ingots: number): number {
  return ingots * 9;
}

export function toIngotsFromBlocks(blocks: number): number {
  return blocks * 9;
}

export function isIntegerCycle(): boolean {
  return true;
}
