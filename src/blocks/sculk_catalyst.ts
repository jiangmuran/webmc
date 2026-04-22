// Sculk catalyst. When a mob dies within 8 blocks, spreads sculk / sculk
// veins / sometimes a sculk sensor / shrieker to the nearby area using
// the mob's XP drop as "charge".

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

const SPREAD_RADIUS = 8;
const VEIN_PROB = 0.1;
const SENSOR_PROB = 0.02;
const SHRIEKER_PROB = 0.005;

export type SculkSpreadBlock = 'sculk' | 'sculk_vein' | 'sculk_sensor' | 'sculk_shrieker';

export interface CatalystLookup {
  isReplaceable(x: number, y: number, z: number): boolean;
}

// Consumes XP charge, placing sculk blocks around `deathPos`.
export function consumeCharge(
  catalystPos: Vec3,
  deathPos: Vec3,
  xpAmount: number,
  lookup: CatalystLookup,
  rng: () => number = Math.random,
): readonly { pos: Vec3; block: SculkSpreadBlock }[] {
  const dx = deathPos.x - catalystPos.x;
  const dy = deathPos.y - catalystPos.y;
  const dz = deathPos.z - catalystPos.z;
  if (Math.hypot(dx, dy, dz) > SPREAD_RADIUS) return [];
  const out: { pos: Vec3; block: SculkSpreadBlock }[] = [];
  let charge = xpAmount;
  while (charge > 0 && out.length < 20) {
    const ox = Math.floor((rng() - 0.5) * 6);
    const oy = Math.floor((rng() - 0.5) * 2);
    const oz = Math.floor((rng() - 0.5) * 6);
    const p = { x: deathPos.x + ox, y: deathPos.y + oy, z: deathPos.z + oz };
    if (!lookup.isReplaceable(p.x, p.y, p.z)) {
      charge--;
      continue;
    }
    const r = rng();
    let block: SculkSpreadBlock = 'sculk';
    if (r < SHRIEKER_PROB) block = 'sculk_shrieker';
    else if (r < SHRIEKER_PROB + SENSOR_PROB) block = 'sculk_sensor';
    else if (r < SHRIEKER_PROB + SENSOR_PROB + VEIN_PROB) block = 'sculk_vein';
    out.push({ pos: p, block });
    charge--;
  }
  return out;
}
