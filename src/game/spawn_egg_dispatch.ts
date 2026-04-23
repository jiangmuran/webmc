const SPAWN_EGG_MAP: Record<string, string> = {
  zombie_spawn_egg: 'zombie',
  skeleton_spawn_egg: 'skeleton',
  creeper_spawn_egg: 'creeper',
  cow_spawn_egg: 'cow',
  pig_spawn_egg: 'pig',
  sheep_spawn_egg: 'sheep',
  chicken_spawn_egg: 'chicken',
  villager_spawn_egg: 'villager',
  wolf_spawn_egg: 'wolf',
  cat_spawn_egg: 'cat',
  enderman_spawn_egg: 'enderman',
  blaze_spawn_egg: 'blaze',
  ender_dragon_spawn_egg: 'ender_dragon',
  wither_spawn_egg: 'wither',
  allay_spawn_egg: 'allay',
  axolotl_spawn_egg: 'axolotl',
  frog_spawn_egg: 'frog',
  sniffer_spawn_egg: 'sniffer',
  armadillo_spawn_egg: 'armadillo',
  warden_spawn_egg: 'warden',
  breeze_spawn_egg: 'breeze',
  bogged_spawn_egg: 'bogged',
  creaking_spawn_egg: 'creaking',
};

export function entityFromSpawnEgg(itemId: string): string | undefined {
  return SPAWN_EGG_MAP[itemId];
}

export function isSpawnEgg(itemId: string): boolean {
  return itemId.endsWith('_spawn_egg');
}
