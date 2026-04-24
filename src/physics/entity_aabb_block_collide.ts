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

export function moveAndCollide(
  aabb: AABB,
  vx: number,
  vy: number,
  vz: number,
  blockBoxes: readonly AABB[],
): { x: number; y: number; z: number; onGround: boolean } {
  const translated = {
    minX: aabb.minX + vx,
    maxX: aabb.maxX + vx,
    minY: aabb.minY + vy,
    maxY: aabb.maxY + vy,
    minZ: aabb.minZ + vz,
    maxZ: aabb.maxZ + vz,
  };
  let onGround = false;
  const finalX = translated.minX;
  let finalY = translated.minY;
  const finalZ = translated.minZ;
  for (const b of blockBoxes) {
    if (intersects(translated, b)) {
      if (vy < 0) {
        onGround = true;
        finalY = b.maxY;
      }
    }
  }
  return { x: finalX, y: finalY, z: finalZ, onGround };
}
