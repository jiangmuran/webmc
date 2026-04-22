// Stronghold generator. Strongholds are deep-underground labyrinths with
// ~14 room types tiled along corridor segments, up to ~50 rooms each. The
// unique room is the portal room (one per stronghold) containing the end
// portal frame.

export type StrongholdRoom =
  | 'corridor'
  | 'corridor_turn'
  | 'stairs_spiral'
  | 'stairs_straight'
  | 'library_small'
  | 'library_tall'
  | 'prison_hall'
  | 'chest_corridor'
  | 'five_way'
  | 'empty'
  | 'portal_room';

export interface StrongholdRoomDef {
  kind: StrongholdRoom;
  weight: number;
  maxCount: number; // hard limit per stronghold
}

export const STRONGHOLD_ROOMS: Record<StrongholdRoom, StrongholdRoomDef> = {
  corridor: { kind: 'corridor', weight: 40, maxCount: 50 },
  corridor_turn: { kind: 'corridor_turn', weight: 10, maxCount: 20 },
  stairs_spiral: { kind: 'stairs_spiral', weight: 5, maxCount: 6 },
  stairs_straight: { kind: 'stairs_straight', weight: 5, maxCount: 6 },
  library_small: { kind: 'library_small', weight: 4, maxCount: 1 },
  library_tall: { kind: 'library_tall', weight: 2, maxCount: 1 },
  prison_hall: { kind: 'prison_hall', weight: 5, maxCount: 4 },
  chest_corridor: { kind: 'chest_corridor', weight: 5, maxCount: 8 },
  five_way: { kind: 'five_way', weight: 5, maxCount: 3 },
  empty: { kind: 'empty', weight: 10, maxCount: 30 },
  portal_room: { kind: 'portal_room', weight: 0, maxCount: 1 }, // placed explicitly
};

export interface PlacedStrongholdRoom {
  kind: StrongholdRoom;
  index: number;
}

export interface StrongholdQuery {
  rng: () => number;
  targetRoomCount: number;
}

export function planStronghold(q: StrongholdQuery): PlacedStrongholdRoom[] {
  const out: PlacedStrongholdRoom[] = [];
  const used: Record<StrongholdRoom, number> = {
    corridor: 0,
    corridor_turn: 0,
    stairs_spiral: 0,
    stairs_straight: 0,
    library_small: 0,
    library_tall: 0,
    prison_hall: 0,
    chest_corridor: 0,
    five_way: 0,
    empty: 0,
    portal_room: 0,
  };
  // Always start with a corridor.
  out.push({ kind: 'corridor', index: 0 });
  used.corridor++;
  while (out.length < q.targetRoomCount) {
    const pool = Object.values(STRONGHOLD_ROOMS).filter(
      (r) => r.weight > 0 && used[r.kind] < r.maxCount,
    );
    if (pool.length === 0) break;
    const picked = weightedPick(pool, q.rng());
    if (!picked) break;
    out.push({ kind: picked.kind, index: out.length });
    used[picked.kind]++;
  }
  // One portal room at the end.
  out.push({ kind: 'portal_room', index: out.length });
  return out;
}

function weightedPick(pool: StrongholdRoomDef[], roll: number): StrongholdRoomDef | null {
  const total = pool.reduce((s, p) => s + p.weight, 0);
  const target = roll * total;
  let acc = 0;
  for (const p of pool) {
    acc += p.weight;
    if (target < acc) return p;
  }
  return pool[pool.length - 1] ?? null;
}

export function hasPortalRoom(placements: readonly PlacedStrongholdRoom[]): boolean {
  return placements.some((p) => p.kind === 'portal_room');
}
