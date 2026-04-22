// Sculk vein. Spreads on any solid face when adjacent to another sculk
// vein or sculk block. Emits 0 light but is visibly glowy.

export type Face = 'top' | 'bottom' | 'north' | 'south' | 'east' | 'west';

export interface VeinQuery {
  faces: Record<Face, { solidHere: boolean; sculkAdjacent: boolean }>;
}

export interface VeinShape {
  on: Face[];
}

export function veinShape(q: VeinQuery): VeinShape {
  const on: Face[] = [];
  for (const f of ['top', 'bottom', 'north', 'south', 'east', 'west'] as const) {
    const info = q.faces[f];
    if (info.solidHere && info.sculkAdjacent) on.push(f);
  }
  return { on };
}

export function hasAnyFace(s: VeinShape): boolean {
  return s.on.length > 0;
}

// Spread to a new face: requires (a) face surface is solid and (b)
// another sculk/vein is touching.
export interface SpreadQuery {
  targetFace: Face;
  surfaceSolid: boolean;
  hasSculkNearby: boolean;
  rand: () => number;
}

export const SPREAD_CHANCE = 0.015;

export function shouldSpread(q: SpreadQuery): boolean {
  if (!q.surfaceSolid) return false;
  if (!q.hasSculkNearby) return false;
  return q.rand() < SPREAD_CHANCE;
}
