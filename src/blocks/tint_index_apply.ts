// Tint index application. Foliage, grass, water, redstone dust have
// tints computed from biome; applied per-vertex to multiply texture color.

export type TintIndex = 0 | 1 | 2 | 3;

export function grassTint(biomeTemperature: number, biomeHumidity: number): number {
  const t = Math.max(0, Math.min(1, biomeTemperature));
  const h = Math.max(0, Math.min(1, biomeHumidity)) * t;
  // simple gradient: cool/wet → green, dry → yellow-brown
  const r = 0.33 + (1 - h) * 0.4;
  const g = 0.5 + h * 0.3;
  const b = 0.25 + t * 0.2;
  return (Math.round(r * 255) << 16) | (Math.round(g * 255) << 8) | Math.round(b * 255);
}

export function foliageTint(biomeTemperature: number, biomeHumidity: number): number {
  return grassTint(biomeTemperature, biomeHumidity) & 0x00ffff;
}

export function redstoneTint(signalStrength: number): number {
  const t = Math.max(0, Math.min(15, signalStrength)) / 15;
  const r = Math.round((0.4 + 0.6 * t) * 255);
  return (r << 16) | 0;
}

export function waterTintForBiome(biomeTemperature: number): number {
  const t = Math.max(0, Math.min(1, biomeTemperature));
  const b = 0.4 + 0.4 * (1 - t);
  return (0x3f << 16) | (0x76 << 8) | Math.round(b * 255);
}
