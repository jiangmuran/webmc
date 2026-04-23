// AABB intersection + swept-volume test for entity motion.

export interface AABB {
  minX: number;
  minY: number;
  minZ: number;
  maxX: number;
  maxY: number;
  maxZ: number;
}

export function intersects(a: AABB, b: AABB): boolean {
  return (
    a.minX < b.maxX &&
    a.maxX > b.minX &&
    a.minY < b.maxY &&
    a.maxY > b.minY &&
    a.minZ < b.maxZ &&
    a.maxZ > b.minZ
  );
}

export function contains(a: AABB, x: number, y: number, z: number): boolean {
  return x >= a.minX && x <= a.maxX && y >= a.minY && y <= a.maxY && z >= a.minZ && z <= a.maxZ;
}

export function expand(a: AABB, dx: number, dy: number, dz: number): AABB {
  return {
    minX: a.minX - Math.abs(dx),
    minY: a.minY - Math.abs(dy),
    minZ: a.minZ - Math.abs(dz),
    maxX: a.maxX + Math.abs(dx),
    maxY: a.maxY + Math.abs(dy),
    maxZ: a.maxZ + Math.abs(dz),
  };
}

export function sweptOverlap(a: AABB, b: AABB, dx: number, dy: number, dz: number): boolean {
  const expanded = {
    minX: Math.min(a.minX, a.minX + dx),
    minY: Math.min(a.minY, a.minY + dy),
    minZ: Math.min(a.minZ, a.minZ + dz),
    maxX: Math.max(a.maxX, a.maxX + dx),
    maxY: Math.max(a.maxY, a.maxY + dy),
    maxZ: Math.max(a.maxZ, a.maxZ + dz),
  };
  return intersects(expanded, b);
}
