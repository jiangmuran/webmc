// Compass, clock, recovery-compass, map. Each answers a specific
// environmental query. Designed to be called from the HUD/inventory UI,
// not from gameplay ticks.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

// Compass returns the yaw in radians pointing toward the target (spawn by
// default, lodestone if bound). Null when pointing randomly in the Nether
// or End (other dimensions).
export interface CompassQuery {
  fromPos: Vec3;
  targetPos: Vec3 | null;
  dimension: string; // 'overworld' / 'nether' / 'end'
  rng?: () => number;
}

export function compassYaw(q: CompassQuery): number | null {
  if (!q.targetPos) return null;
  if (q.dimension !== 'overworld') {
    // MC: compass spins randomly in nether/end unless bound to a lodestone.
    return (q.rng ?? Math.random)() * Math.PI * 2 - Math.PI;
  }
  const dx = q.targetPos.x - q.fromPos.x;
  const dz = q.targetPos.z - q.fromPos.z;
  return Math.atan2(dx, dz);
}

// Clock: returns an angle in [0, 2π) representing "where is the sun?". MC
// time 0 = midnight at top, 6000 = noon at bottom, 12000 = sunset.
export function clockAngle(timeOfDay: number): number {
  const normalized = ((timeOfDay % 24000) + 24000) % 24000;
  return (normalized / 24000) * Math.PI * 2;
}

// Map: a 128×128 sampled image of world blocks around a center. Returns
// a per-pixel RGBA encoded as a Uint8ClampedArray. Caller supplies a
// sampler for the surface block at each world coord.
export interface MapSampler {
  surfaceColor(wx: number, wz: number): readonly [number, number, number];
}

export interface MapRender {
  bitmap: Uint8ClampedArray; // 128 × 128 × 4 (RGBA)
  centerX: number;
  centerZ: number;
  scale: number; // world blocks per map pixel (MC: 1, 2, 4, 8, 16)
}

export function renderMap(center: Vec3, scale: number, sampler: MapSampler): MapRender {
  const bitmap = new Uint8ClampedArray(128 * 128 * 4);
  for (let py = 0; py < 128; py++) {
    for (let px = 0; px < 128; px++) {
      const wx = Math.floor(center.x - 64 * scale + px * scale);
      const wz = Math.floor(center.z - 64 * scale + py * scale);
      const rgb = sampler.surfaceColor(wx, wz);
      const offset = (py * 128 + px) * 4;
      bitmap[offset] = rgb[0];
      bitmap[offset + 1] = rgb[1];
      bitmap[offset + 2] = rgb[2];
      bitmap[offset + 3] = 255;
    }
  }
  return { bitmap, centerX: center.x, centerZ: center.z, scale };
}
