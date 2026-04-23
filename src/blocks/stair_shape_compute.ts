export type StairShape = 'straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right';

export interface StairCtx {
  facing: 'n' | 's' | 'e' | 'w';
  neighborLeft?: 'n' | 's' | 'e' | 'w';
  neighborRight?: 'n' | 's' | 'e' | 'w';
  neighborBack?: 'n' | 's' | 'e' | 'w';
}

function perpendicular(a: string, b: string): boolean {
  return (
    ((a === 'n' || a === 's') && (b === 'e' || b === 'w')) ||
    ((a === 'e' || a === 'w') && (b === 'n' || b === 's'))
  );
}

export function computeShape(c: StairCtx): StairShape {
  if (c.neighborBack && perpendicular(c.facing, c.neighborBack)) {
    return c.neighborBack === 'n' || c.neighborBack === 'w' ? 'inner_left' : 'inner_right';
  }
  if (c.neighborLeft && perpendicular(c.facing, c.neighborLeft)) return 'outer_left';
  if (c.neighborRight && perpendicular(c.facing, c.neighborRight)) return 'outer_right';
  return 'straight';
}
