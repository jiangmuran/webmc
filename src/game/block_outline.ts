// Block outline rendering. The targeted block gets a black wireframe
// cube overlay. Highlighting respects the block's collision shape:
//   - Full cubes: a simple 1×1 outline
//   - Slabs: 1×0.5 (top or bottom half)
//   - Stairs: two boxes (step + lower face)
//   - Fences/walls: the 9-piece connected shape

export type BlockShapeKind = 'cube' | 'slab' | 'stairs' | 'fence' | 'wall' | 'custom' | 'empty';

export interface BlockShape {
  kind: BlockShapeKind;
  boxes: readonly {
    minX: number;
    minY: number;
    minZ: number;
    maxX: number;
    maxY: number;
    maxZ: number;
  }[];
}

export function fullCubeShape(): BlockShape {
  return {
    kind: 'cube',
    boxes: [{ minX: 0, minY: 0, minZ: 0, maxX: 1, maxY: 1, maxZ: 1 }],
  };
}

export function slabShape(top: boolean): BlockShape {
  return {
    kind: 'slab',
    boxes: [
      top
        ? { minX: 0, minY: 0.5, minZ: 0, maxX: 1, maxY: 1, maxZ: 1 }
        : { minX: 0, minY: 0, minZ: 0, maxX: 1, maxY: 0.5, maxZ: 1 },
    ],
  };
}

export function stairsShape(): BlockShape {
  return {
    kind: 'stairs',
    boxes: [
      { minX: 0, minY: 0, minZ: 0, maxX: 1, maxY: 0.5, maxZ: 1 },
      { minX: 0, minY: 0.5, minZ: 0, maxX: 1, maxY: 1, maxZ: 0.5 },
    ],
  };
}

// Render line-set for a shape: wireframe edges, 12 per box.
export interface WireframeLine {
  from: { x: number; y: number; z: number };
  to: { x: number; y: number; z: number };
}

export function wireframeLinesFor(shape: BlockShape): WireframeLine[] {
  const out: WireframeLine[] = [];
  for (const b of shape.boxes) {
    const corners = [
      { x: b.minX, y: b.minY, z: b.minZ },
      { x: b.maxX, y: b.minY, z: b.minZ },
      { x: b.minX, y: b.maxY, z: b.minZ },
      { x: b.maxX, y: b.maxY, z: b.minZ },
      { x: b.minX, y: b.minY, z: b.maxZ },
      { x: b.maxX, y: b.minY, z: b.maxZ },
      { x: b.minX, y: b.maxY, z: b.maxZ },
      { x: b.maxX, y: b.maxY, z: b.maxZ },
    ];
    const edges: [number, number][] = [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
      [4, 5],
      [4, 6],
      [5, 7],
      [6, 7],
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7],
    ];
    for (const [i, j] of edges) {
      const a = corners[i];
      const c = corners[j];
      if (!a || !c) continue;
      out.push({ from: a, to: c });
    }
  }
  return out;
}

export function outlineColor(hasWater: boolean): { r: number; g: number; b: number; a: number } {
  if (hasWater) return { r: 255, g: 255, b: 255, a: 255 };
  return { r: 0, g: 0, b: 0, a: 180 };
}
