// Model rotation helpers. Cube models carry a base orientation;
// at placement time they rotate to match block facing.

export type Rotation = 0 | 90 | 180 | 270;

export function rotationForFacing(facing: 'north' | 'south' | 'east' | 'west'): Rotation {
  if (facing === 'north') return 0;
  if (facing === 'east') return 90;
  if (facing === 'south') return 180;
  return 270;
}

export function uvOffsetForRotation(r: Rotation): { dU: number; dV: number } {
  if (r === 0) return { dU: 0, dV: 0 };
  if (r === 90) return { dU: 0.25, dV: 0 };
  if (r === 180) return { dU: 0.5, dV: 0 };
  return { dU: 0.75, dV: 0 };
}

export function rotatedFacing(
  facing: 'north' | 'south' | 'east' | 'west',
  r: Rotation,
): typeof facing {
  const order: (typeof facing)[] = ['north', 'east', 'south', 'west'];
  const idx = order.indexOf(facing);
  const shift = (r / 90) as 0 | 1 | 2 | 3;
  return order[(idx + shift) % 4] ?? facing;
}
