export type BastionType = 'hoglin_stable' | 'treasure' | 'housing_units' | 'bridge';

export function lootBias(b: BastionType): string[] {
  switch (b) {
    case 'hoglin_stable':
      return ['saddle', 'gilded_blackstone', 'hoglin_spawn'];
    case 'treasure':
      return ['netherite_scrap', 'ancient_debris', 'netherite_ingot'];
    case 'housing_units':
      return ['crying_obsidian', 'respawn_anchor', 'piglin_brutes'];
    case 'bridge':
      return ['piglin_brutes', 'gilded_blackstone', 'magma_cream'];
  }
}

export function spawnWeight(): number {
  return 1;
}
