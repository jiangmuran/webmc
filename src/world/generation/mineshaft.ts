// Abandoned mineshaft. Random tree of 3×3 wood-framed corridors with
// cobwebs, cave spider spawners, rail intersections, and a minecart
// chest at branch ends.

export type MineshaftPiece = 'corridor' | 'crossing' | 'stairs' | 'rail_chest' | 'spawner_room';

export interface MineshaftPieceDef {
  kind: MineshaftPiece;
  weight: number;
}

export const MINESHAFT_POOL: readonly MineshaftPieceDef[] = [
  { kind: 'corridor', weight: 30 },
  { kind: 'crossing', weight: 8 },
  { kind: 'stairs', weight: 5 },
  { kind: 'rail_chest', weight: 3 },
  { kind: 'spawner_room', weight: 1 },
];

export interface PlacedMineshaftPiece {
  kind: MineshaftPiece;
  depth: number;
}

export interface MineshaftQuery {
  rng: () => number;
  maxDepth: number;
  maxPieces: number;
}

export function planMineshaft(q: MineshaftQuery): PlacedMineshaftPiece[] {
  const out: PlacedMineshaftPiece[] = [{ kind: 'corridor', depth: 0 }];
  while (out.length < q.maxPieces) {
    const parent = out[out.length - 1];
    if (!parent || parent.depth >= q.maxDepth) break;
    const picked = pickPiece(q.rng());
    if (!picked) break;
    out.push({ kind: picked.kind, depth: parent.depth + 1 });
  }
  return out;
}

function pickPiece(roll: number): MineshaftPieceDef | null {
  const total = MINESHAFT_POOL.reduce((s, p) => s + p.weight, 0);
  const target = roll * total;
  let acc = 0;
  for (const p of MINESHAFT_POOL) {
    acc += p.weight;
    if (target < acc) return p;
  }
  return MINESHAFT_POOL[MINESHAFT_POOL.length - 1] ?? null;
}

// Cobweb density per corridor piece in MC is ~15% of solid faces.
export const COBWEB_DENSITY = 0.15;

export interface MineshaftLootEntry {
  item: string;
  weight: number;
  min: number;
  max: number;
}

export const MINECART_CHEST_LOOT: readonly MineshaftLootEntry[] = [
  { item: 'webmc:diamond', weight: 3, min: 1, max: 2 },
  { item: 'webmc:gold_ingot', weight: 5, min: 1, max: 3 },
  { item: 'webmc:iron_ingot', weight: 10, min: 1, max: 5 },
  { item: 'webmc:lapis', weight: 5, min: 1, max: 10 },
  { item: 'webmc:emerald', weight: 3, min: 1, max: 1 },
  { item: 'webmc:name_tag', weight: 2, min: 1, max: 1 },
  { item: 'webmc:rail', weight: 20, min: 4, max: 8 },
  { item: 'webmc:activator_rail', weight: 5, min: 1, max: 4 },
  { item: 'webmc:detector_rail', weight: 5, min: 1, max: 4 },
  { item: 'webmc:powered_rail', weight: 5, min: 1, max: 4 },
  { item: 'webmc:redstone', weight: 5, min: 4, max: 9 },
];

export function rollMinecartLoot(roll: number): MineshaftLootEntry | null {
  const total = MINECART_CHEST_LOOT.reduce((s, e) => s + e.weight, 0);
  const target = roll * total;
  let acc = 0;
  for (const e of MINECART_CHEST_LOOT) {
    acc += e.weight;
    if (target < acc) return e;
  }
  return MINECART_CHEST_LOOT[MINECART_CHEST_LOOT.length - 1] ?? null;
}
