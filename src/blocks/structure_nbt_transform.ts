// Structure NBT placement. Structure block supports load/save/corner.
// Transforms: rotation 0/90/180/270 and mirror x/y/none.

export type Rotation = 0 | 90 | 180 | 270;
export type Mirror = 'none' | 'x' | 'z';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export function rotate(v: Vec3, r: Rotation): Vec3 {
  if (r === 0) return v;
  const z = (a: number): number => (a === 0 ? 0 : a);
  if (r === 90) return { x: z(-v.z), y: v.y, z: z(v.x) };
  if (r === 180) return { x: z(-v.x), y: v.y, z: z(-v.z) };
  return { x: z(v.z), y: v.y, z: z(-v.x) };
}

export function mirror(v: Vec3, m: Mirror): Vec3 {
  if (m === 'none') return v;
  if (m === 'x') return { x: -v.x, y: v.y, z: v.z };
  return { x: v.x, y: v.y, z: -v.z };
}

export function transform(v: Vec3, r: Rotation, m: Mirror): Vec3 {
  return rotate(mirror(v, m), r);
}
