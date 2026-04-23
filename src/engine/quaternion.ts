// Unit quaternion ops for camera / mob rotation interp.

export interface Quat {
  x: number;
  y: number;
  z: number;
  w: number;
}

export const IDENTITY: Quat = { x: 0, y: 0, z: 0, w: 1 };

export function fromAxisAngle(ax: number, ay: number, az: number, angleRad: number): Quat {
  const s = Math.sin(angleRad / 2);
  return { x: ax * s, y: ay * s, z: az * s, w: Math.cos(angleRad / 2) };
}

export function multiply(a: Quat, b: Quat): Quat {
  return {
    x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
    y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
    z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w,
    w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
  };
}

export function normalize(q: Quat): Quat {
  const m = Math.hypot(q.x, q.y, q.z, q.w) || 1;
  return { x: q.x / m, y: q.y / m, z: q.z / m, w: q.w / m };
}

export function slerp(a: Quat, b: Quat, t: number): Quat {
  let d = a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
  let bb = b;
  if (d < 0) {
    bb = { x: -b.x, y: -b.y, z: -b.z, w: -b.w };
    d = -d;
  }
  if (d > 0.9995) {
    return normalize({
      x: a.x + (bb.x - a.x) * t,
      y: a.y + (bb.y - a.y) * t,
      z: a.z + (bb.z - a.z) * t,
      w: a.w + (bb.w - a.w) * t,
    });
  }
  const theta = Math.acos(d);
  const sinTheta = Math.sin(theta);
  const sa = Math.sin((1 - t) * theta) / sinTheta;
  const sb = Math.sin(t * theta) / sinTheta;
  return {
    x: a.x * sa + bb.x * sb,
    y: a.y * sa + bb.y * sb,
    z: a.z * sa + bb.z * sb,
    w: a.w * sa + bb.w * sb,
  };
}
