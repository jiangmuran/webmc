// Iceberg. Frozen-ocean biome structure: 3-11 layered lumps of packed
// ice and blue ice jutting out of the sea, with snowy tops. Occasionally
// stacked to heights of 30+ blocks.

export interface IcebergLayout {
  segments: readonly IcebergSegment[];
  height: number;
  maxRadius: number;
}

export interface IcebergSegment {
  at: { x: number; y: number; z: number };
  radius: number;
  material: 'packed_ice' | 'blue_ice' | 'snow_block';
}

export interface IcebergQuery {
  origin: { x: number; y: number; z: number };
  rng: () => number;
  maxHeight: number;
}

export function planIceberg(q: IcebergQuery): IcebergLayout {
  const segCount = 3 + Math.floor(q.rng() * 9); // 3..11
  const segs: IcebergSegment[] = [];
  let maxR = 0;
  let y = q.origin.y;
  for (let i = 0; i < segCount; i++) {
    const r = 3 + Math.floor(q.rng() * 5);
    maxR = Math.max(maxR, r);
    const mat: 'packed_ice' | 'blue_ice' | 'snow_block' =
      i === 0 ? 'blue_ice' : i === segCount - 1 ? 'snow_block' : 'packed_ice';
    segs.push({ at: { x: q.origin.x, y, z: q.origin.z }, radius: r, material: mat });
    y += Math.floor(q.rng() * 4) + 2;
    if (y - q.origin.y >= q.maxHeight) break;
  }
  return { segments: segs, height: y - q.origin.y, maxRadius: maxR };
}

// Bottom segment is blue ice (densest + hardest), top is snow_block.
export function materialOfLayer(layer: number, totalLayers: number): string {
  if (layer === 0) return 'webmc:blue_ice';
  if (layer === totalLayers - 1) return 'webmc:snow_block';
  return 'webmc:packed_ice';
}
