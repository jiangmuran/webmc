export type Nylium = 'warped_nylium' | 'crimson_nylium';

export function bonemealOutputs(n: Nylium, rng: () => number): readonly string[] {
  const blocks: string[] = [];
  const count = 1 + Math.floor(rng() * 3);
  for (let i = 0; i < count; i++) {
    if (n === 'warped_nylium') {
      // Wiki: warped_nylium produces warped_roots (~67%), warped_fungus
      // (~13%), nether_sprouts (~13%), twisting_vines (~7%).
      const r = rng();
      if (r < 0.67) blocks.push('warped_roots');
      else if (r < 0.8) blocks.push('warped_fungus');
      else if (r < 0.93) blocks.push('nether_sprouts');
      else blocks.push('twisting_vines');
    } else {
      // Wiki: crimson_nylium produces crimson_roots (~87%) and
      // crimson_fungus (~13%). Was incorrectly producing warped_fungus
      // 15% of the time — wrong biome plant.
      const r = rng();
      if (r < 0.87) blocks.push('crimson_roots');
      else blocks.push('crimson_fungus');
    }
  }
  return blocks;
}

export function spreadsToNetherrack(adjacentNylium: number): boolean {
  return adjacentNylium > 0;
}
