// Furnace fuel → items smelted, accounting for output buffer overflow.

export interface FurnaceCtx {
  fuelBurnTicks: number;
  itemsAvailable: number;
  outputFree: number;
}

export const TICKS_PER_ITEM = 200;

export function simulateBurn(c: FurnaceCtx): { itemsSmelted: number; fuelLeft: number } {
  const maxByFuel = Math.floor(c.fuelBurnTicks / TICKS_PER_ITEM);
  const possible = Math.min(c.itemsAvailable, c.outputFree, maxByFuel);
  const fuelUsed = possible * TICKS_PER_ITEM;
  return { itemsSmelted: possible, fuelLeft: c.fuelBurnTicks - fuelUsed };
}

export function fuelWasteWhenNoItems(burnTicks: number, items: number): number {
  if (items > 0) return 0;
  return burnTicks;
}
