// Water bottle / splash water. Splashing water extinguishes fire blocks
// in range + damages blazes + endermen (they teleport away).

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface SplashLookup {
  firePositions(center: Vec3, radius: number): readonly Vec3[];
  blazeEntities(center: Vec3, radius: number): readonly number[];
  endermanEntities(center: Vec3, radius: number): readonly number[];
}

export interface SplashWaterResult {
  extinguishedFire: readonly Vec3[];
  damagedBlazeIds: readonly number[];
  teleportedEndermanIds: readonly number[];
}

const SPLASH_RADIUS = 4;
const BLAZE_DAMAGE = 1;

export function splashWater(center: Vec3, lookup: SplashLookup): SplashWaterResult {
  return {
    extinguishedFire: lookup.firePositions(center, SPLASH_RADIUS),
    damagedBlazeIds: lookup.blazeEntities(center, SPLASH_RADIUS),
    teleportedEndermanIds: lookup.endermanEntities(center, SPLASH_RADIUS),
  };
}

export { BLAZE_DAMAGE };
