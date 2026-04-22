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

export function tickGrassBlock(ctx: GrassSpreadCtx): GrassPlacement[] {
  const placements: GrassPlacement[] = [];
  const { center: c, lookup, rng } = ctx;
  // Decay: grass with opaque block above turns to dirt after a few ticks.
  if (lookup.isGrass(c.x, c.y, c.z) && lookup.hasOpaqueAbove(c.x, c.y + 1, c.z)) {
    if (rng() < 0.05) placements.push({ pos: c, block: 'webmc:dirt' });
    return placements;
  }
  // Spread: grass at center → try to grass-ify a nearby dirt block (+1 y
  // tolerance for hill climbing).
  if (!lookup.isGrass(c.x, c.y, c.z)) return placements;
  if (rng() > 0.1) return placements;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dz = -1; dz <= 1; dz++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0 && dz === 0) continue;
        const t = { x: c.x + dx, y: c.y + dy, z: c.z + dz };
        if (!lookup.isDirt(t.x, t.y, t.z)) continue;
        if (lookup.hasOpaqueAbove(t.x, t.y + 1, t.z)) continue;
        if (lookup.lightAbove(t.x, t.y + 1, t.z) < 9) continue;
        placements.push({ pos: t, block: 'webmc:grass_block' });
        return placements;
      }
    }
  }
  return placements;
}
