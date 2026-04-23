// Cartographer trades explorer maps. Generates a map pointing to the
// nearest unfound structure of the given kind.

export type StructureKind = 'monument' | 'mansion' | 'buried_treasure' | 'trial_chambers';

export interface MapSearchCtx {
  playerX: number;
  playerZ: number;
  structures: { kind: StructureKind; x: number; z: number; known: boolean }[];
}

export function pickMapTarget(
  c: MapSearchCtx,
  kind: StructureKind,
): { x: number; z: number } | null {
  let best: { x: number; z: number } | null = null;
  let bestD = Infinity;
  for (const s of c.structures) {
    if (s.kind !== kind || s.known) continue;
    const d = Math.hypot(s.x - c.playerX, s.z - c.playerZ);
    if (d < bestD) {
      bestD = d;
      best = { x: s.x, z: s.z };
    }
  }
  return best;
}

export const EXPLORER_MAP_SCALE = 2; // map grid unit per world block
