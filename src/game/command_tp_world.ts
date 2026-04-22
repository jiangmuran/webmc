// /tp, /teleport. Supports absolute and relative coords (~), and
// dimension transfer.

export type Coord = { kind: 'abs'; value: number } | { kind: 'rel'; offset: number };

export interface TpQuery {
  targetId: string;
  currentPos: { x: number; y: number; z: number };
  currentDim: string;
  to: { x: Coord; y: Coord; z: Coord; dim?: string };
}

export interface TpResult {
  newPos: { x: number; y: number; z: number };
  newDim: string;
}

function resolve(c: Coord, cur: number): number {
  return c.kind === 'abs' ? c.value : cur + c.offset;
}

export function teleport(q: TpQuery): TpResult {
  return {
    newPos: {
      x: resolve(q.to.x, q.currentPos.x),
      y: resolve(q.to.y, q.currentPos.y),
      z: resolve(q.to.z, q.currentPos.z),
    },
    newDim: q.to.dim ?? q.currentDim,
  };
}

// Parse a single coord token.
export function parseCoordToken(tok: string, cur: number): Coord | null {
  if (tok.startsWith('~')) {
    const rest = tok.slice(1);
    if (rest === '') return { kind: 'rel', offset: 0 };
    const n = Number(rest);
    if (Number.isNaN(n)) return null;
    return { kind: 'rel', offset: n };
  }
  const n = Number(tok);
  if (Number.isNaN(n)) return null;
  void cur;
  return { kind: 'abs', value: n };
}
