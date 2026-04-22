// Lightning strike trigger. During thunder weather, randomly picks an
// outdoor column within the loaded area; the strike point is the highest
// non-air block at that column. Emits a strike event the caller uses to
// damage entities, start a fire, and transmute mobs per MC rules:
//   creeper  → charged_creeper (deferred)
//   pig      → zombie_piglin   (deferred — entity transmute)
//   mooshroom → coloured swap  (deferred)

import type { Weather } from './weather';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface LightningTarget {
  position: Vec3;
  nearbyEntities: readonly { id: number; position: Vec3 }[];
}

export interface LightningEvent {
  position: Vec3;
  radius: number;
  damage: number; // 5 HP per MC wiki (before armor)
  startsFire: boolean;
  affectedEntityIds: readonly number[];
}

export interface StrikeContext {
  weather: Weather;
  chanceBaseline: number; // per-second probability of a strike in the loaded area
  surfaceHeight: (x: number, z: number) => number;
  pickColumn: () => { x: number; z: number } | null;
  entitiesNear: (pos: Vec3, radius: number) => readonly { id: number; position: Vec3 }[];
  rng: () => number;
}

const STRIKE_DAMAGE = 5;
const STRIKE_RADIUS = 3;

// Consider one simulation step. Returns a strike event or null. The caller
// tick loop applies damage, starts fire, etc.
export function maybeStrike(dtSec: number, ctx: StrikeContext): LightningEvent | null {
  if (ctx.weather.current !== 'thunder') return null;
  if (ctx.rng() >= ctx.chanceBaseline * dtSec) return null;
  const col = ctx.pickColumn();
  if (!col) return null;
  const y = ctx.surfaceHeight(col.x, col.z);
  const pos: Vec3 = { x: col.x, y: y + 1, z: col.z };
  const hit = ctx.entitiesNear(pos, STRIKE_RADIUS);
  return {
    position: pos,
    radius: STRIKE_RADIUS,
    damage: STRIKE_DAMAGE,
    startsFire: true,
    affectedEntityIds: hit.map((e) => e.id),
  };
}

// Fire-tick: given a fire-block's world position, return the set of block
// positions to ignite (neighbours of appropriate material) and whether the
// fire should decay this tick. Pure — integration with a BlockRegistry and
// a flammability table is the caller's job.

export interface FireTickContext {
  isFlammable: (x: number, y: number, z: number) => boolean;
  hasAirAbove: (x: number, y: number, z: number) => boolean;
  rng: () => number;
  spreadChance: number; // 0..1
  decayChance: number; // 0..1
}

export interface FireStep {
  ignite: readonly Vec3[];
  extinguish: boolean;
}

export function fireTick(firePos: Vec3, ctx: FireTickContext): FireStep {
  const ignite: Vec3[] = [];
  const OFFSETS: readonly Vec3[] = [
    { x: -1, y: 0, z: 0 },
    { x: 1, y: 0, z: 0 },
    { x: 0, y: 0, z: -1 },
    { x: 0, y: 0, z: 1 },
    { x: 0, y: -1, z: 0 },
    { x: 0, y: 1, z: 0 },
  ];
  for (const o of OFFSETS) {
    const nx = firePos.x + o.x;
    const ny = firePos.y + o.y;
    const nz = firePos.z + o.z;
    if (!ctx.isFlammable(nx, ny, nz)) continue;
    if (!ctx.hasAirAbove(nx, ny, nz) && o.y !== 1) continue;
    if (ctx.rng() < ctx.spreadChance) ignite.push({ x: nx, y: ny, z: nz });
  }
  const extinguish = ctx.rng() < ctx.decayChance;
  return { ignite, extinguish };
}
