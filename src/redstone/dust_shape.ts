// Redstone dust connection shape. A dust block connects horizontally to
// any powerable neighbor (dust, repeater side, observer, etc.) and
// connects UP if the neighbor has dust on top and the block above the
// center dust isn't solid. Shape: "cross" (all 4), "side" (opposite 2),
// or "dot" (nothing). Mixed patterns use up-ramps for vertical paths.

export const CONN_N = 1 << 0;
export const CONN_S = 1 << 1;
export const CONN_E = 1 << 2;
export const CONN_W = 1 << 3;

export const CONN_UP_N = 1 << 4;
export const CONN_UP_S = 1 << 5;
export const CONN_UP_E = 1 << 6;
export const CONN_UP_W = 1 << 7;

export interface DustLookup {
  receivesPower: (dx: number, dy: number, dz: number) => boolean;
  isDust: (dx: number, dy: number, dz: number) => boolean;
  isSolid: (dx: number, dy: number, dz: number) => boolean;
}

export interface DustShape {
  horizontalMask: number;
  upMask: number;
  renderKind: 'dot' | 'side' | 'cross';
}

export function dustShape(lookup: DustLookup): DustShape {
  let horizontal = 0;
  let up = 0;
  const centerAboveSolid = lookup.isSolid(0, 1, 0);
  const dirs: { flag: number; upFlag: number; x: number; z: number }[] = [
    { flag: CONN_N, upFlag: CONN_UP_N, x: 0, z: -1 },
    { flag: CONN_S, upFlag: CONN_UP_S, x: 0, z: 1 },
    { flag: CONN_E, upFlag: CONN_UP_E, x: 1, z: 0 },
    { flag: CONN_W, upFlag: CONN_UP_W, x: -1, z: 0 },
  ];
  for (const d of dirs) {
    if (lookup.receivesPower(d.x, 0, d.z) || lookup.isDust(d.x, 0, d.z)) {
      horizontal |= d.flag;
    }
    if (!centerAboveSolid && lookup.isDust(d.x, 1, d.z) && lookup.isSolid(d.x, 0, d.z)) {
      horizontal |= d.flag;
      up |= d.upFlag;
    }
    if (lookup.isDust(d.x, -1, d.z) && !lookup.isSolid(d.x, 0, d.z)) {
      horizontal |= d.flag;
    }
  }
  return {
    horizontalMask: horizontal,
    upMask: up,
    renderKind: classifyKind(horizontal),
  };
}

function classifyKind(mask: number): 'dot' | 'side' | 'cross' {
  if (mask === 0) return 'dot';
  const ns = mask & (CONN_N | CONN_S);
  const ew = mask & (CONN_E | CONN_W);
  if (ns !== 0 && ew !== 0) return 'cross';
  return 'side';
}
