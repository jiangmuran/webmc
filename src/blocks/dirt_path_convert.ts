export interface ShovelUse {
  target: string;
  topBlockIsAir: boolean;
}

// Wiki (minecraft.wiki/w/Shovel): grass_block, dirt, podzol, mycelium,
// and coarse_dirt convert to dirt_path. rooted_dirt is a SEPARATE
// shovel action — it converts to plain dirt and drops a hanging
// roots item, not dirt_path. Old set listed rooted_dirt as
// dirt-path-convertible, so a player shoveling rooted_dirt got a
// dirt-path block instead of dirt + hanging_roots. Sibling
// items/shovel_path.ts already separates the two paths via discrete
// action kinds; harmonised this convertible set.
export const CONVERTIBLE = new Set(['grass_block', 'dirt', 'podzol', 'mycelium', 'coarse_dirt']);

export function canConvert(u: ShovelUse): boolean {
  return u.topBlockIsAir && CONVERTIBLE.has(u.target);
}

export function convertedBlock(): string {
  return 'dirt_path';
}

export function tramplingPreventedByFarmland(): boolean {
  return false;
}
