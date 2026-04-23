// Cubic Bezier + Catmull-Rom spline evaluation for cinematic camera paths.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export function cubicBezier(p0: Vec3, p1: Vec3, p2: Vec3, p3: Vec3, t: number): Vec3 {
  const u = 1 - t;
  const b0 = u * u * u;
  const b1 = 3 * u * u * t;
  const b2 = 3 * u * t * t;
  const b3 = t * t * t;
  return {
    x: p0.x * b0 + p1.x * b1 + p2.x * b2 + p3.x * b3,
    y: p0.y * b0 + p1.y * b1 + p2.y * b2 + p3.y * b3,
    z: p0.z * b0 + p1.z * b1 + p2.z * b2 + p3.z * b3,
  };
}

export function catmullRom(p0: Vec3, p1: Vec3, p2: Vec3, p3: Vec3, t: number): Vec3 {
  const t2 = t * t;
  const t3 = t2 * t;
  const a = (v0: number, v1: number, v2: number, v3: number): number =>
    0.5 *
    (2 * v1 +
      (-v0 + v2) * t +
      (2 * v0 - 5 * v1 + 4 * v2 - v3) * t2 +
      (-v0 + 3 * v1 - 3 * v2 + v3) * t3);
  return {
    x: a(p0.x, p1.x, p2.x, p3.x),
    y: a(p0.y, p1.y, p2.y, p3.y),
    z: a(p0.z, p1.z, p2.z, p3.z),
  };
}
