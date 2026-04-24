export interface AtlasTile {
  id: string;
  u: number;
  v: number;
  size: number;
}

export function packAtlas(
  tileIds: readonly string[],
  tileSize: number,
  atlasSize: number,
): readonly AtlasTile[] {
  const perRow = Math.floor(atlasSize / tileSize);
  const tiles: AtlasTile[] = [];
  for (let i = 0; i < tileIds.length; i++) {
    const col = i % perRow;
    const row = Math.floor(i / perRow);
    if (row >= perRow) break;
    const id = tileIds[i];
    if (id === undefined) continue;
    tiles.push({
      id,
      u: (col * tileSize) / atlasSize,
      v: (row * tileSize) / atlasSize,
      size: tileSize / atlasSize,
    });
  }
  return tiles;
}

export function atlasCapacity(tileSize: number, atlasSize: number): number {
  const perRow = Math.floor(atlasSize / tileSize);
  return perRow * perRow;
}
