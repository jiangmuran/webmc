// Seagrass + kelp growth helpers. Bone meal on water creates seagrass
// patches. Each candidate position has a chance (weighted by proximity
// to the clicked block) of receiving tall seagrass or plain seagrass.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface SeagrassLookup {
  isWater: (x: number, y: number, z: number) => boolean;
  isWaterTop: (x: number, y: number, z: number) => boolean; // true if space above is also water
  topSolidBelow: (x: number, y: number, z: number) => boolean; // dirt / sand / stone
}

export interface BoneMealSeagrassQuery {
  center: Vec3;
  radius: number; // default 7
  lookup: SeagrassLookup;
  rng: () => number;
}

export interface SeagrassEvent {
  pos: Vec3;
  block: 'webmc:seagrass' | 'webmc:tall_seagrass';
}

export function boneMealSeagrass(q: BoneMealSeagrassQuery): SeagrassEvent[] {
  const events: SeagrassEvent[] = [];
  const radius = q.radius;
  for (let dx = -radius; dx <= radius; dx++) {
    for (let dz = -radius; dz <= radius; dz++) {
      const x = q.center.x + dx;
      const z = q.center.z + dz;
      const y = q.center.y;
      if (!q.lookup.isWater(x, y, z)) continue;
      if (!q.lookup.topSolidBelow(x, y - 1, z)) continue;
      const dist = Math.hypot(dx, dz);
      const chance = Math.max(0, 1 - dist / radius) * 0.35;
      if (q.rng() > chance) continue;
      // 1/3 chance for tall seagrass if two water blocks stacked.
      if (q.lookup.isWater(x, y + 1, z) && q.rng() < 1 / 3) {
        events.push({ pos: { x, y, z }, block: 'webmc:tall_seagrass' });
      } else {
        events.push({ pos: { x, y, z }, block: 'webmc:seagrass' });
      }
    }
  }
  return events;
}

// Kelp growth: each random tick, the tip (topmost water-aligned kelp)
// has a 1/7 chance to grow up one block, up to 25 blocks tall.
export interface KelpGrowCtx {
  age: number;
  roll: number;
  topIsWaterAndAirBlock: boolean;
}

export const MAX_KELP_HEIGHT = 25;

export function tryKelpGrow(q: KelpGrowCtx): boolean {
  if (q.age >= MAX_KELP_HEIGHT) return false;
  if (!q.topIsWaterAndAirBlock) return false;
  return q.roll < 1 / 7;
}
