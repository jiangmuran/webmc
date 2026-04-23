// Jigsaw structure placement. Pieces have "connectors" with target_pool
// names. Assembly grows outward until depth exhausted or overlap.

export interface Connector {
  pool: string;
  facing: 'north' | 'south' | 'east' | 'west' | 'up' | 'down';
  attachedTo: string | null;
}

export interface Piece {
  id: string;
  bounds: { w: number; h: number; d: number };
  connectors: Connector[];
}

export interface PoolEntry {
  pieceId: string;
  weight: number;
}

export interface Assembly {
  placed: Piece[];
  depth: number;
  maxDepth: number;
}

export function makeAssembly(root: Piece, maxDepth = 7): Assembly {
  return { placed: [root], depth: 0, maxDepth };
}

export function canExtend(a: Assembly): boolean {
  return a.depth < a.maxDepth;
}

export function openConnectors(a: Assembly): Connector[] {
  const out: Connector[] = [];
  for (const p of a.placed) {
    for (const c of p.connectors) if (c.attachedTo === null) out.push(c);
  }
  return out;
}

export function weightedPick(pool: PoolEntry[], rand: () => number): PoolEntry | null {
  if (pool.length === 0) return null;
  const total = pool.reduce((s, e) => s + e.weight, 0);
  let r = rand() * total;
  for (const e of pool) {
    if (r < e.weight) return e;
    r -= e.weight;
  }
  return pool[pool.length - 1] ?? null;
}
