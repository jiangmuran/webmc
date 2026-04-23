export interface Border {
  centerX: number;
  centerZ: number;
  sizeBlocks: number;
  damagePerBlock: number;
  damageBuffer: number;
}

export function distanceOutside(b: Border, x: number, z: number): number {
  const half = b.sizeBlocks / 2;
  const outsideX = Math.max(0, Math.abs(x - b.centerX) - half);
  const outsideZ = Math.max(0, Math.abs(z - b.centerZ) - half);
  return Math.max(outsideX, outsideZ);
}

export function damagePerTick(b: Border, x: number, z: number): number {
  const d = distanceOutside(b, x, z);
  const effective = Math.max(0, d - b.damageBuffer);
  return effective * b.damagePerBlock;
}
