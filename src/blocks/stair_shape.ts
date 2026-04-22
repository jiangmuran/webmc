// Stair shape computation. A stair block looks at its 4 horizontal
// neighbors; if a neighbor is also a stair facing perpendicular to this
// one, this stair renders as an inner/outer corner.

export type Facing = 'north' | 'south' | 'east' | 'west';
export type StairShape = 'straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right';
export type Half = 'top' | 'bottom';

export interface StairBlock {
  facing: Facing;
  half: Half;
  shape: StairShape;
  waterlogged: boolean;
}

export interface StairLookup {
  stairAt: (dx: number, dy: number, dz: number) => StairBlock | null;
}

function back(f: Facing): Facing {
  switch (f) {
    case 'north':
      return 'south';
    case 'south':
      return 'north';
    case 'east':
      return 'west';
    case 'west':
      return 'east';
  }
}

function offset(f: Facing): { dx: number; dz: number } {
  switch (f) {
    case 'north':
      return { dx: 0, dz: -1 };
    case 'south':
      return { dx: 0, dz: 1 };
    case 'east':
      return { dx: 1, dz: 0 };
    case 'west':
      return { dx: -1, dz: 0 };
  }
}

function perpendicular(a: Facing, b: Facing): boolean {
  return (
    ((a === 'north' || a === 'south') && (b === 'east' || b === 'west')) ||
    ((a === 'east' || a === 'west') && (b === 'north' || b === 'south'))
  );
}

function rightOf(f: Facing): Facing {
  switch (f) {
    case 'north':
      return 'east';
    case 'east':
      return 'south';
    case 'south':
      return 'west';
    case 'west':
      return 'north';
  }
}

// Given this stair's facing/half, compute its shape based on neighbors.
export function computeStairShape(
  self: { facing: Facing; half: Half },
  lookup: StairLookup,
): StairShape {
  const frontOff = offset(self.facing);
  const front = lookup.stairAt(frontOff.dx, 0, frontOff.dz);
  if (front?.half === self.half && perpendicular(front.facing, self.facing)) {
    const right = rightOf(self.facing);
    return front.facing === right ? 'outer_right' : 'outer_left';
  }
  const backOff = offset(back(self.facing));
  const backN = lookup.stairAt(backOff.dx, 0, backOff.dz);
  if (backN?.half === self.half && perpendicular(backN.facing, self.facing)) {
    const right = rightOf(self.facing);
    return backN.facing === right ? 'inner_right' : 'inner_left';
  }
  return 'straight';
}
