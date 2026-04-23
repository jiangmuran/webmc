export interface FuelSpec {
  burnTicks: number;
}

const FUELS: Record<string, FuelSpec> = {
  coal: { burnTicks: 1600 },
  charcoal: { burnTicks: 1600 },
  coal_block: { burnTicks: 16000 },
  wooden_planks: { burnTicks: 300 },
  oak_log: { burnTicks: 300 },
  stick: { burnTicks: 100 },
  blaze_rod: { burnTicks: 2400 },
  lava_bucket: { burnTicks: 20000 },
  dried_kelp_block: { burnTicks: 4000 },
};

export function burnTicks(fuel: string): number {
  return FUELS[fuel]?.burnTicks ?? 0;
}

export const DEFAULT_SMELT_TICKS = 200;
export const BLAST_FURNACE_SMELT_TICKS = 100;
export const SMOKER_SMELT_TICKS = 100;

export function itemsSmeltable(fuel: string, smeltTicks = DEFAULT_SMELT_TICKS): number {
  return Math.floor(burnTicks(fuel) / smeltTicks);
}
