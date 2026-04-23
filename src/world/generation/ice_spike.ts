export interface SpikeParams {
  baseRadius: number;
  height: number;
  seed: number;
}

export function radiusAt(p: SpikeParams, y: number): number {
  if (y < 0 || y >= p.height) return 0;
  const t = y / p.height;
  return Math.max(0, p.baseRadius * (1 - t));
}

export function allowedBiomes(): readonly string[] {
  return ['ice_spikes'] as const;
}

export function rollHeight(seed: number, x: number, z: number): number {
  const h = (Math.imul(x + seed, 2654435761) ^ Math.imul(z, 1597334677)) >>> 0;
  return 7 + (h % 17);
}
