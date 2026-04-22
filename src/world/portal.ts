// Portal frame detection — a 2×3 inner rectangle of air ringed by obsidian
// on one axis (x or z). Returns the inner cells to fill with portal block
// when a valid frame is present.

export interface PortalFrame {
  readonly axis: 'x' | 'z';
  readonly inner: readonly { x: number; y: number; z: number }[];
}

export interface PortalLookup {
  isObsidian(x: number, y: number, z: number): boolean;
  isAir(x: number, y: number, z: number): boolean;
}

function check(
  l: PortalLookup,
  axis: 'x' | 'z',
  x: number,
  y: number,
  z: number,
  dx: number,
  dz: number,
): PortalFrame | null {
  // Frame: 4 tall × 3 wide (outer) with 2-wide × 3-tall air interior.
  // Vertical corners + base + top = 10 obsidian blocks.
  for (let w = 0; w < 4; w++) {
    const cx = x + dx * w;
    const cz = z + dz * w;
    // base
    if (!l.isObsidian(cx, y, cz)) return null;
    // top
    if (!l.isObsidian(cx, y + 4, cz)) return null;
  }
  for (let h = 1; h <= 3; h++) {
    // left
    if (!l.isObsidian(x, y + h, z)) return null;
    // right
    if (!l.isObsidian(x + dx * 3, y + h, z + dz * 3)) return null;
  }
  // inside must be air
  const inner: { x: number; y: number; z: number }[] = [];
  for (let w = 1; w <= 2; w++) {
    for (let h = 1; h <= 3; h++) {
      const cx = x + dx * w;
      const cz = z + dz * w;
      if (!l.isAir(cx, y + h, cz)) return null;
      inner.push({ x: cx, y: y + h, z: cz });
    }
  }
  return { axis, inner };
}

// Given a starting block inside what might be a portal, search in both axes
// for a 2-wide × 3-tall air interior fully ringed by obsidian.
export function findPortalFrame(
  l: PortalLookup,
  startX: number,
  startY: number,
  startZ: number,
): PortalFrame | null {
  for (const axis of ['x', 'z'] as const) {
    const dx = axis === 'x' ? 1 : 0;
    const dz = axis === 'z' ? 1 : 0;
    for (let w = -2; w <= 0; w++) {
      for (let h = -3; h <= 0; h++) {
        const baseX = startX + dx * w;
        const baseZ = startZ + dz * w;
        const baseY = startY + h;
        const f = check(l, axis, baseX, baseY, baseZ, dx, dz);
        if (f) return f;
      }
    }
  }
  return null;
}
