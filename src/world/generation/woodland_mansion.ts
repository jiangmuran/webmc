// Woodland mansion template graph. Mansions are 3-story dark-oak-wood
// buildings built from ~20 distinct room templates tiled on a 7×7 grid
// per floor, with stairs connecting floors and a flat roof.

export type MansionRoomKind =
  | 'foyer'
  | 'corridor'
  | 'bedroom'
  | 'library'
  | 'secret_library'
  | 'dining'
  | 'altar'
  | 'forge'
  | 'stairs_up'
  | 'balcony'
  | 'empty_3x3'
  | 'gilded_treasury'
  | 'evoker_room'
  | 'vindicator_barracks';

export interface MansionRoomDef {
  kind: MansionRoomKind;
  weight: number;
  floorAllowed: readonly (1 | 2 | 3)[];
}

export const MANSION_ROOMS: Record<MansionRoomKind, MansionRoomDef> = {
  foyer: { kind: 'foyer', weight: 1, floorAllowed: [1] },
  corridor: { kind: 'corridor', weight: 10, floorAllowed: [1, 2, 3] },
  bedroom: { kind: 'bedroom', weight: 3, floorAllowed: [1, 2, 3] },
  library: { kind: 'library', weight: 2, floorAllowed: [1, 2, 3] },
  secret_library: { kind: 'secret_library', weight: 1, floorAllowed: [2, 3] },
  dining: { kind: 'dining', weight: 2, floorAllowed: [1] },
  altar: { kind: 'altar', weight: 1, floorAllowed: [2, 3] },
  forge: { kind: 'forge', weight: 2, floorAllowed: [1] },
  stairs_up: { kind: 'stairs_up', weight: 3, floorAllowed: [1, 2] },
  balcony: { kind: 'balcony', weight: 2, floorAllowed: [3] },
  empty_3x3: { kind: 'empty_3x3', weight: 4, floorAllowed: [1, 2, 3] },
  gilded_treasury: { kind: 'gilded_treasury', weight: 1, floorAllowed: [2, 3] },
  evoker_room: { kind: 'evoker_room', weight: 1, floorAllowed: [2, 3] },
  vindicator_barracks: { kind: 'vindicator_barracks', weight: 2, floorAllowed: [1, 2, 3] },
};

export interface PlacedMansionRoom {
  kind: MansionRoomKind;
  gridX: number;
  gridZ: number;
  floor: 1 | 2 | 3;
}

export interface MansionQuery {
  gridSize: number; // typically 7
  rng: () => number;
}

// Fills the mansion grid floor by floor. Foyer is always at the grid
// center on floor 1; corridors connect adjacent rooms (implicit in room
// defs). Returns the flat room placement list.
export function planMansion(q: MansionQuery): PlacedMansionRoom[] {
  const out: PlacedMansionRoom[] = [];
  const floors: (1 | 2 | 3)[] = [1, 2, 3];
  const mid = Math.floor(q.gridSize / 2);
  for (const floor of floors) {
    for (let x = 0; x < q.gridSize; x++) {
      for (let z = 0; z < q.gridSize; z++) {
        if (floor === 1 && x === mid && z === mid) {
          out.push({ kind: 'foyer', gridX: x, gridZ: z, floor });
          continue;
        }
        const candidates = Object.values(MANSION_ROOMS).filter((r) =>
          r.floorAllowed.includes(floor),
        );
        const picked = pickRoom(candidates, q.rng());
        if (picked) out.push({ kind: picked.kind, gridX: x, gridZ: z, floor });
      }
    }
  }
  return out;
}

function pickRoom(pool: MansionRoomDef[], roll: number): MansionRoomDef | null {
  if (pool.length === 0) return null;
  const total = pool.reduce((s, p) => s + p.weight, 0);
  const target = roll * total;
  let acc = 0;
  for (const p of pool) {
    acc += p.weight;
    if (target < acc) return p;
  }
  return pool[pool.length - 1] ?? null;
}

export function countRooms(
  placements: readonly PlacedMansionRoom[],
  kind: MansionRoomKind,
): number {
  let n = 0;
  for (const p of placements) if (p.kind === kind) n++;
  return n;
}
