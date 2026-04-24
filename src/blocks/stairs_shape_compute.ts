export type StairShape = 'straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right';
export type Facing = 'north' | 'south' | 'east' | 'west';

export function computeShape(
  facing: Facing,
  behindFacing: Facing | undefined,
  inFrontFacing: Facing | undefined,
): StairShape {
  if (
    inFrontFacing !== undefined &&
    inFrontFacing !== facing &&
    !isOpposite(facing, inFrontFacing)
  ) {
    return isRightOf(facing, inFrontFacing) ? 'outer_right' : 'outer_left';
  }
  if (behindFacing !== undefined && behindFacing !== facing && !isOpposite(facing, behindFacing)) {
    return isRightOf(facing, behindFacing) ? 'inner_right' : 'inner_left';
  }
  return 'straight';
}

function isOpposite(a: Facing, b: Facing): boolean {
  return (
    (a === 'north' && b === 'south') ||
    (a === 'south' && b === 'north') ||
    (a === 'east' && b === 'west') ||
    (a === 'west' && b === 'east')
  );
}

function isRightOf(a: Facing, b: Facing): boolean {
  if (a === 'north') return b === 'east';
  if (a === 'south') return b === 'west';
  if (a === 'east') return b === 'south';
  return b === 'north';
}
