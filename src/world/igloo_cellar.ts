// Igloo. 50% chance to contain a basement cellar with zombie villager
// + villager + brewing stand (splash of weakness) + golden apple.

export const IGLOO_BASEMENT_CHANCE = 0.5;

export function hasBasement(rand: () => number): boolean {
  return rand() < IGLOO_BASEMENT_CHANCE;
}

export interface IglooCtx {
  hasBasement: boolean;
}

export function contents(c: IglooCtx): string[] {
  const base = ['bed_white', 'crafting_table', 'redstone_torch'];
  if (!c.hasBasement) return base;
  return [
    ...base,
    'brewing_stand_splash_weakness',
    'splash_potion_weakness',
    'golden_apple',
    'zombie_villager',
    'villager',
  ];
}

export function findHalfBlockCount(c: IglooCtx): number {
  return c.hasBasement ? 3 : 0;
}
