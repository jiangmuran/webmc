export const ORE_XP: Record<string, [number, number]> = {
  coal_ore: [0, 2],
  deepslate_coal_ore: [0, 2],
  iron_ore: [0, 0],
  deepslate_iron_ore: [0, 0],
  gold_ore: [0, 0],
  deepslate_gold_ore: [0, 0],
  diamond_ore: [3, 7],
  deepslate_diamond_ore: [3, 7],
  emerald_ore: [3, 7],
  deepslate_emerald_ore: [3, 7],
  lapis_ore: [2, 5],
  deepslate_lapis_ore: [2, 5],
  redstone_ore: [1, 5],
  deepslate_redstone_ore: [1, 5],
  nether_gold_ore: [0, 1],
  nether_quartz_ore: [2, 5],
  copper_ore: [0, 0],
  deepslate_copper_ore: [0, 0],
};

export function xpForOre(ore: string, rng: () => number, silkTouch: boolean): number {
  if (silkTouch) return 0;
  const range = ORE_XP[ore];
  if (!range) return 0;
  const [min, max] = range;
  return min + Math.floor(rng() * (max - min + 1));
}
