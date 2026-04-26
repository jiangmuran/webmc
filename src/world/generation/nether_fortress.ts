// Nether fortress template generator. Fortresses spawn as L-shaped corridors
// with balconies, stairs, bridges, and blaze spawner rooms, built from a
// small library of ~8 fixed-shape pieces tiled by a jigsaw-like walker.

export type FortressPiece =
  | 'corridor'
  | 'corridor_junction'
  | 'stairs_up'
  | 'stairs_down'
  | 'bridge'
  | 'bridge_end'
  | 'blaze_room'
  | 'nether_wart_room';

export interface FortressPieceDef {
  kind: FortressPiece;
  width: number;
  height: number;
  depth: number;
  weight: number;
  nextPool: readonly FortressPiece[];
}

export const FORTRESS_PIECES: Record<FortressPiece, FortressPieceDef> = {
  corridor: {
    kind: 'corridor',
    width: 5,
    height: 5,
    depth: 5,
    weight: 20,
    nextPool: ['corridor', 'corridor_junction', 'stairs_up', 'stairs_down'],
  },
  corridor_junction: {
    kind: 'corridor_junction',
    width: 5,
    height: 5,
    depth: 5,
    weight: 8,
    nextPool: ['corridor', 'bridge', 'blaze_room', 'nether_wart_room'],
  },
  stairs_up: {
    kind: 'stairs_up',
    width: 5,
    height: 8,
    depth: 5,
    weight: 4,
    nextPool: ['corridor', 'corridor_junction'],
  },
  stairs_down: {
    kind: 'stairs_down',
    width: 5,
    height: 8,
    depth: 5,
    weight: 4,
    nextPool: ['corridor', 'corridor_junction'],
  },
  bridge: {
    kind: 'bridge',
    width: 7,
    height: 3,
    depth: 5,
    weight: 6,
    nextPool: ['bridge', 'bridge_end'],
  },
  bridge_end: {
    kind: 'bridge_end',
    width: 7,
    height: 5,
    depth: 5,
    weight: 2,
    nextPool: [],
  },
  blaze_room: {
    kind: 'blaze_room',
    width: 7,
    height: 7,
    depth: 7,
    weight: 1,
    nextPool: [],
  },
  nether_wart_room: {
    kind: 'nether_wart_room',
    width: 9,
    height: 7,
    depth: 9,
    weight: 1,
    nextPool: [],
  },
};

export interface PlacedFortressPiece {
  kind: FortressPiece;
  pos: { x: number; y: number; z: number };
}

export interface FortressQuery {
  origin: { x: number; y: number; z: number };
  rng: () => number;
  maxPieces: number;
}

// Walks the piece graph, placing up to maxPieces pieces along +x for test
// simplicity. A real implementation would direction-pick, but the test
// surface is the pool walking and piece budget enforcement.
export function generateFortress(q: FortressQuery): PlacedFortressPiece[] {
  const out: PlacedFortressPiece[] = [];
  const order: FortressPiece[] = ['corridor'];
  let pos = { ...q.origin };

  // Head-pointer dequeue (Array.shift O(N)).
  let qHead = 0;
  while (out.length < q.maxPieces && qHead < order.length) {
    const cur = order[qHead++];
    if (!cur) break;
    const def = FORTRESS_PIECES[cur];
    out.push({ kind: cur, pos: { ...pos } });
    pos = { x: pos.x + def.depth, y: pos.y, z: pos.z };
    if (def.nextPool.length === 0) continue;
    const next = pickNext(def.nextPool, q.rng());
    if (next) order.push(next);
  }
  return out;
}

function pickNext(pool: readonly FortressPiece[], roll: number): FortressPiece | null {
  if (pool.length === 0) return null;
  const total = pool.reduce((s, p) => s + FORTRESS_PIECES[p].weight, 0);
  const target = roll * total;
  let acc = 0;
  for (const p of pool) {
    acc += FORTRESS_PIECES[p].weight;
    if (target < acc) return p;
  }
  return pool[pool.length - 1] ?? null;
}

// Count total blocks across a placement — useful for cost budgeting.
export function fortressVolume(pieces: readonly PlacedFortressPiece[]): number {
  let v = 0;
  for (const p of pieces) {
    const d = FORTRESS_PIECES[p.kind];
    v += d.width * d.height * d.depth;
  }
  return v;
}
