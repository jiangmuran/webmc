// Furnace fuel burn times (in ticks). Smelts 1 item per 200 ticks.
// Fuel burn time ≥ 200 means the fuel burns > 1 item.

export const FUEL_BURN: Record<string, number> = {
  lava_bucket: 20000,
  coal_block: 16000,
  blaze_rod: 2400,
  coal: 1600,
  charcoal: 1600,
  oak_log: 300,
  oak_planks: 300,
  stick: 100,
  sapling: 100,
  bamboo: 50,
  dried_kelp_block: 4001,
};

export function burnTicksFor(fuel: string): number {
  return FUEL_BURN[fuel] ?? 0;
}

export function isFuel(fuel: string): boolean {
  return burnTicksFor(fuel) > 0;
}

export function itemsSmeltedPerFuelUnit(fuel: string): number {
  return Math.floor(burnTicksFor(fuel) / 200);
}
