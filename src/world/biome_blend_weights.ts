// Biome blending. At chunk boundaries, samples a small kernel of biomes
// and returns weighted heightmap + grass color.

export interface BiomeSample {
  biomeId: string;
  weight: number;
  baseHeight: number;
  amplitude: number;
}

export function averageHeight(samples: BiomeSample[]): number {
  let total = 0;
  let weight = 0;
  for (const s of samples) {
    total += (s.baseHeight + s.amplitude * 0.5) * s.weight;
    weight += s.weight;
  }
  return weight > 0 ? total / weight : 0;
}

export function mixColorRGB(samples: { rgb: number; weight: number }[]): number {
  let r = 0;
  let g = 0;
  let b = 0;
  let weight = 0;
  for (const s of samples) {
    r += ((s.rgb >> 16) & 0xff) * s.weight;
    g += ((s.rgb >> 8) & 0xff) * s.weight;
    b += (s.rgb & 0xff) * s.weight;
    weight += s.weight;
  }
  if (weight === 0) return 0;
  const rr = Math.round(r / weight);
  const gg = Math.round(g / weight);
  const bb = Math.round(b / weight);
  return (rr << 16) | (gg << 8) | bb;
}

export function dominantBiome(samples: BiomeSample[]): string | null {
  let best = '';
  let bestW = -1;
  for (const s of samples) {
    if (s.weight > bestW) {
      best = s.biomeId;
      bestW = s.weight;
    }
  }
  return best || null;
}
