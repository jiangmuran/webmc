// Structure template rotation. Structures (villages, mineshafts, etc.)
// are stored once and rotated/mirrored into 8 variants. Coordinates
// rotate around Y axis; block states with "facing" properties also
// rotate.

export type Rotation = 0 | 90 | 180 | 270;
export type Mirror = 'none' | 'x' | 'z';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export function rotateXZ(v: Vec3, r: Rotation): Vec3 {
  switch (r) {
    case 0:
      return { x: v.x, y: v.y, z: v.z };
    case 90:
      return { x: -v.z || 0, y: v.y, z: v.x };
    case 180:
      return { x: -v.x || 0, y: v.y, z: -v.z || 0 };
    case 270:
      return { x: v.z, y: v.y, z: -v.x || 0 };
  }
}

export function mirrorXZ(v: Vec3, m: Mirror): Vec3 {
  if (m === 'x') return { x: -v.x, y: v.y, z: v.z };
  if (m === 'z') return { x: v.x, y: v.y, z: -v.z };
  return v;
}

export type CardinalFacing = 'north' | 'south' | 'east' | 'west';

const FACING_ORDER: CardinalFacing[] = ['north', 'east', 'south', 'west'];

export function rotateFacing(f: CardinalFacing, r: Rotation): CardinalFacing {
  const i = FACING_ORDER.indexOf(f);
  const steps = r / 90;
  return FACING_ORDER[(i + steps) % 4] ?? f;
}

export function mirrorFacing(f: CardinalFacing, m: Mirror): CardinalFacing {
  if (m === 'x') {
    if (f === 'east') return 'west';
    if (f === 'west') return 'east';
  }
  if (m === 'z') {
    if (f === 'north') return 'south';
    if (f === 'south') return 'north';
  }
  return f;
}
