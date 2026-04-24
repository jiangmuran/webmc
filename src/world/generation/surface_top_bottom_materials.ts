export type Biome =
  | 'plains'
  | 'forest'
  | 'desert'
  | 'snowy_taiga'
  | 'mushroom_fields'
  | 'badlands'
  | 'swamp';

export function surfaceTopBlock(biome: Biome): string {
  if (biome === 'desert') return 'sand';
  if (biome === 'badlands') return 'red_sand';
  if (biome === 'mushroom_fields') return 'mycelium';
  if (biome === 'snowy_taiga') return 'snow_block';
  return 'grass_block';
}

export function surfaceUnderBlock(biome: Biome): string {
  if (biome === 'desert') return 'sandstone';
  if (biome === 'badlands') return 'red_sandstone';
  return 'dirt';
}

export function needsBedrock(y: number, minY: number): boolean {
  return y <= minY + 4 && y >= minY;
}
