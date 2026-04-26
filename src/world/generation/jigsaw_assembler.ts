// Jigsaw-pool structure assembler. Used by 1.17+ villages, ancient cities,
// trial chambers. A structure is a tree of placed templates: each template
// has jigsaw connectors, each connector picks a random template from a pool
// whose connectors match, up to a depth cap.

export interface JigsawConnector {
  readonly id: string;
  readonly targetPool: string;
  // local offset of the connector from the template origin
  readonly dx: number;
  readonly dy: number;
  readonly dz: number;
  // direction the connector faces: +x, -x, +y, -y, +z, -z
  readonly face: Face;
}

export type Face = '+x' | '-x' | '+y' | '-y' | '+z' | '-z';

export interface JigsawTemplate {
  readonly name: string;
  readonly connectors: readonly JigsawConnector[];
  // bounding box relative to template origin
  readonly size: { x: number; y: number; z: number };
  readonly weight: number;
}

export interface JigsawPool {
  readonly name: string;
  readonly templates: readonly JigsawTemplate[];
}

export interface PoolRegistry {
  readonly pools: ReadonlyMap<string, JigsawPool>;
}

export interface PlacedTemplate {
  template: string;
  pos: { x: number; y: number; z: number };
}

export interface AssembleQuery {
  startPool: string;
  origin: { x: number; y: number; z: number };
  maxDepth: number;
  registry: PoolRegistry;
  rng: () => number;
}

// Walks the jigsaw graph depth-first, placing templates until maxDepth or
// a connector has no matching template. This is the deterministic spine;
// collision resolution is left to the caller.
export function assembleJigsaw(q: AssembleQuery): PlacedTemplate[] {
  const out: PlacedTemplate[] = [];
  const startPool = q.registry.pools.get(q.startPool);
  if (!startPool || startPool.templates.length === 0) return out;
  const start = pickTemplate(startPool, q.rng());
  if (!start) return out;
  out.push({ template: start.name, pos: { ...q.origin } });

  interface Pending {
    tpl: JigsawTemplate;
    at: { x: number; y: number; z: number };
    depth: number;
  }
  const queue: Pending[] = [{ tpl: start, at: { ...q.origin }, depth: 0 }];

  // Head-pointer dequeue (Array.shift is O(N) per pop).
  let qHead = 0;
  while (qHead < queue.length) {
    const cur = queue[qHead++];
    if (!cur || cur.depth >= q.maxDepth) continue;
    for (const c of cur.tpl.connectors) {
      const pool = q.registry.pools.get(c.targetPool);
      if (!pool || pool.templates.length === 0) continue;
      const next = pickTemplate(pool, q.rng());
      if (!next) continue;
      const placePos = {
        x: cur.at.x + c.dx + faceDelta(c.face).x,
        y: cur.at.y + c.dy + faceDelta(c.face).y,
        z: cur.at.z + c.dz + faceDelta(c.face).z,
      };
      out.push({ template: next.name, pos: placePos });
      queue.push({ tpl: next, at: placePos, depth: cur.depth + 1 });
    }
  }
  return out;
}

function pickTemplate(pool: JigsawPool, roll: number): JigsawTemplate | null {
  const total = pool.templates.reduce((s, t) => s + t.weight, 0);
  if (total <= 0) return null;
  const target = roll * total;
  let acc = 0;
  for (const t of pool.templates) {
    acc += t.weight;
    if (target < acc) return t;
  }
  return pool.templates[pool.templates.length - 1] ?? null;
}

function faceDelta(f: Face): { x: number; y: number; z: number } {
  switch (f) {
    case '+x':
      return { x: 1, y: 0, z: 0 };
    case '-x':
      return { x: -1, y: 0, z: 0 };
    case '+y':
      return { x: 0, y: 1, z: 0 };
    case '-y':
      return { x: 0, y: -1, z: 0 };
    case '+z':
      return { x: 0, y: 0, z: 1 };
    case '-z':
      return { x: 0, y: 0, z: -1 };
  }
}
