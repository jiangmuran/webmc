// Lead tie. Attaching a lead to a fence creates a "leash knot"; up to
// 10 mobs can be tied to one knot. Range rules mirror leash stretch
// (snap past 12, drop at 10).

export interface Knot {
  fenceX: number;
  fenceY: number;
  fenceZ: number;
  tiedMobIds: Set<string>;
}

export const MAX_MOBS_PER_KNOT = 10;
export const LEASH_MAX = 10;
export const LEASH_SNAP = 12;

export function makeKnot(x: number, y: number, z: number): Knot {
  return { fenceX: x, fenceY: y, fenceZ: z, tiedMobIds: new Set() };
}

export function tieMob(knot: Knot, mobId: string): 'ok' | 'full' | 'already' {
  if (knot.tiedMobIds.has(mobId)) return 'already';
  if (knot.tiedMobIds.size >= MAX_MOBS_PER_KNOT) return 'full';
  knot.tiedMobIds.add(mobId);
  return 'ok';
}

export function untie(knot: Knot, mobId: string): boolean {
  return knot.tiedMobIds.delete(mobId);
}

export interface StretchQuery {
  mob: { x: number; y: number; z: number };
  knot: { x: number; y: number; z: number };
}

export type StretchResult = 'ok' | 'pull' | 'snap';

export function stretchState(q: StretchQuery): StretchResult {
  const dx = q.mob.x - q.knot.x;
  const dy = q.mob.y - q.knot.y;
  const dz = q.mob.z - q.knot.z;
  const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
  if (d > LEASH_SNAP) return 'snap';
  if (d > LEASH_MAX) return 'pull';
  return 'ok';
}
