export interface Entity {
  x: number;
  y: number;
  z: number;
  boundingRadius: number;
}

export interface Sphere {
  cx: number;
  cy: number;
  cz: number;
  radius: number;
}

export interface Plane {
  nx: number;
  ny: number;
  nz: number;
  d: number;
}

export function sphereBehindPlane(p: Plane, s: Sphere): boolean {
  return p.nx * s.cx + p.ny * s.cy + p.nz * s.cz + p.d < -s.radius;
}

export function entityVisible(planes: Plane[], e: Entity): boolean {
  const s: Sphere = { cx: e.x, cy: e.y, cz: e.z, radius: e.boundingRadius };
  for (const p of planes) if (sphereBehindPlane(p, s)) return false;
  return true;
}
