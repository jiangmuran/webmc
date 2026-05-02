// Grass block ↔ dirt spreading. Grass spreads to adjacent dirt blocks
// in light ≥ 9; grass under a solid opaque block reverts to dirt over time.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface GrassLookup {
  isGrass(x: number, y: number, z: number): boolean;
  isDirt(x: number, y: number, z: number): boolean;
  lightAbove(x: number, y: number, z: number): number;
  hasOpaqueAbove(x: number, y: number, z: number): boolean;
}

export interface GrassSpreadCtx {
  center: Vec3;
  lookup: GrassLookup;
  rng: () => number;
}

export type GrassPlacement =
  | { pos: Vec3; block: 'webmc:grass_block' }
  | { pos: Vec3; block: 'webmc:dirt' };

// Reused per-call placements + result entries. tickGrassBlock returns
// 0 or 1 entries; recycling the array + the single placement objects
// (one for the dirt-decay variant, one for the grass-spread variant)
// avoids a per-call array literal + object literals.
const PLACEMENTS_SCRATCH: GrassPlacement[] = [];
const DIRT_PLACEMENT: { pos: Vec3; block: 'webmc:dirt' } = {
  pos: { x: 0, y: 0, z: 0 },
  block: 'webmc:dirt',
};
const GRASS_PLACEMENT: { pos: Vec3; block: 'webmc:grass_block' } = {
  pos: { x: 0, y: 0, z: 0 },
  block: 'webmc:grass_block',
};

export function tickGrassBlock(ctx: GrassSpreadCtx): GrassPlacement[] {
  const placements = PLACEMENTS_SCRATCH;
  placements.length = 0;
  const { center: c, lookup, rng } = ctx;
  // Decay: grass with opaque block above turns to dirt after a few ticks.
  if (lookup.isGrass(c.x, c.y, c.z) && lookup.hasOpaqueAbove(c.x, c.y + 1, c.z)) {
    if (rng() < 0.05) {
      DIRT_PLACEMENT.pos.x = c.x;
      DIRT_PLACEMENT.pos.y = c.y;
      DIRT_PLACEMENT.pos.z = c.z;
      placements.push(DIRT_PLACEMENT);
    }
    return placements;
  }
  // Spread: grass at center → try to grass-ify a nearby dirt block (+1 y
  // tolerance for hill climbing).
  if (!lookup.isGrass(c.x, c.y, c.z)) return placements;
  if (rng() > 0.1) return placements;
  // Compare raw coordinates instead of allocating a temp Vec3 inside
  // the 27-iteration loop (most iterations short-circuit out via the
  // isDirt / hasOpaqueAbove / lightAbove gates).
  for (let dx = -1; dx <= 1; dx++) {
    for (let dz = -1; dz <= 1; dz++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0 && dz === 0) continue;
        const tx = c.x + dx;
        const ty = c.y + dy;
        const tz = c.z + dz;
        if (!lookup.isDirt(tx, ty, tz)) continue;
        if (lookup.hasOpaqueAbove(tx, ty + 1, tz)) continue;
        if (lookup.lightAbove(tx, ty + 1, tz) < 9) continue;
        GRASS_PLACEMENT.pos.x = tx;
        GRASS_PLACEMENT.pos.y = ty;
        GRASS_PLACEMENT.pos.z = tz;
        placements.push(GRASS_PLACEMENT);
        return placements;
      }
    }
  }
  return placements;
}
