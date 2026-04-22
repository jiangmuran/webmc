// Grass color by biome. MC uses a 256x256 color grid indexed by
// (temperature, downfall). We expose a simplified 2D lookup.

export interface BiomeClimate {
  temperature: number; // 0..2
  downfall: number; // 0..1
}

// Triangular color palette approximation. Cold = blue-green, hot-dry = yellow,
// hot-wet = green.
export function grassColor(c: BiomeClimate): { r: number; g: number; b: number } {
  const t = Math.max(0, Math.min(1.5, c.temperature));
  const d = Math.max(0, Math.min(1, c.downfall)) * t;
  const r = Math.round(160 - d * 40 + (t - 0.5) * 40);
  const g = Math.round(180 + d * 30 - (t - 1) * 10);
  const b = Math.round(80 - d * 50 + (1 - t) * 40);
  return {
    r: Math.max(0, Math.min(255, r)),
    g: Math.max(0, Math.min(255, g)),
    b: Math.max(0, Math.min(255, b)),
  };
}

// Swamp override: constant dark green.
export const SWAMP_COLOR = { r: 106, g: 112, b: 57 };

// Roofed forest: 50% blend with dark overlay.
export function darkForestBlend(base: { r: number; g: number; b: number }): {
  r: number;
  g: number;
  b: number;
} {
  return {
    r: Math.round((base.r + 40) / 2),
    g: Math.round((base.g + 60) / 2),
    b: Math.round((base.b + 30) / 2),
  };
}
