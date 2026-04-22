// Structure jigsaw pool. Each piece advertises "jigsaw" joints; during
// generation, a joint is matched to another piece's compatible joint
// from a weighted pool. Depth-bounded to avoid infinite recursion.

export interface JigsawJoint {
  name: string; // our joint id
  target: string; // pool or joint-name to attach
  offsetX: number;
  offsetY: number;
  offsetZ: number;
}

export interface JigsawPiece {
  id: string;
  weight: number;
  joints: JigsawJoint[];
}

export interface JigsawPool {
  pieces: JigsawPiece[];
  fallback: JigsawPiece | null;
}

export interface SampleQuery {
  pool: JigsawPool;
  rand: () => number;
  atMaxDepth: boolean;
}

export function samplePiece(q: SampleQuery): JigsawPiece | null {
  if (q.atMaxDepth) return q.pool.fallback;
  const total = q.pool.pieces.reduce((a, p) => a + p.weight, 0);
  if (total <= 0) return q.pool.fallback;
  let r = q.rand() * total;
  for (const p of q.pool.pieces) {
    r -= p.weight;
    if (r <= 0) return p;
  }
  return q.pool.pieces[q.pool.pieces.length - 1] ?? q.pool.fallback;
}
