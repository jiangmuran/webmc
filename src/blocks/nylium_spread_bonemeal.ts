export type Nylium = 'warped_nylium' | 'crimson_nylium';

export function bonemealOutputs(n: Nylium, rng: () => number): readonly string[] {
  const blocks: string[] = [];
  const count = 1 + Math.floor(rng() * 3);
  for (let i = 0; i < count; i++) {
    if (n === 'warped_nylium') {
      const r = rng();
      if (r < 0.3) blocks.push('warped_roots');
      else if (r < 0.6) blocks.push('warped_fungus');
      else blocks.push('nether_sprouts');
    } else {
      const r = rng();
      if (r < 0.4) blocks.push('crimson_roots');
      else if (r < 0.85) blocks.push('crimson_fungus');
      else blocks.push('warped_fungus');
    }
  }
  return blocks;
}

export function spreadsToNetherrack(adjacentNylium: number): boolean {
  return adjacentNylium > 0;
}
