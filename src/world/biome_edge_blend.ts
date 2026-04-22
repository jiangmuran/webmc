// Biome edge blending. At biome boundaries, we interpolate temperature
// and heightmap noise over a few blocks to avoid harsh seams.

export interface BiomeSample {
  biomeId: string;
  temperature: number;
  baseHeight: number;
  heightVariation: number;
}

export const BLEND_RADIUS = 4;

export interface BlendQuery {
  at: (dx: number, dz: number) => BiomeSample;
}

export function blendSample(q: BlendQuery): BiomeSample {
  let count = 0;
  let t = 0;
  let h = 0;
  let v = 0;
  let firstId = '';
  for (let dx = -BLEND_RADIUS; dx <= BLEND_RADIUS; dx++) {
    for (let dz = -BLEND_RADIUS; dz <= BLEND_RADIUS; dz++) {
      const s = q.at(dx, dz);
      if (!firstId) firstId = s.biomeId;
      t += s.temperature;
      h += s.baseHeight;
      v += s.heightVariation;
      count += 1;
    }
  }
  return {
    biomeId: q.at(0, 0).biomeId,
    temperature: t / count,
    baseHeight: h / count,
    heightVariation: v / count,
  };
}

// Dominant biome by area (used for biome-id selection at block level).
export function dominantBiome(q: BlendQuery): string {
  const counts = new Map<string, number>();
  for (let dx = -BLEND_RADIUS; dx <= BLEND_RADIUS; dx++) {
    for (let dz = -BLEND_RADIUS; dz <= BLEND_RADIUS; dz++) {
      const id = q.at(dx, dz).biomeId;
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }
  let best = '';
  let bestN = 0;
  for (const [id, n] of counts) {
    if (n > bestN) {
      best = id;
      bestN = n;
    }
  }
  return best;
}
