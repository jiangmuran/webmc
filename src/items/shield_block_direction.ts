export interface BlockInput {
  playerYawRadians: number;
  attackerX: number;
  attackerZ: number;
  playerX: number;
  playerZ: number;
  hasShield: boolean;
  raising: boolean;
}

export const BLOCK_ANGLE_DEGREES = 180;

export function damageBlocked(i: BlockInput): boolean {
  if (!i.hasShield || !i.raising) return false;
  const dx = i.attackerX - i.playerX;
  const dz = i.attackerZ - i.playerZ;
  const attackerAngle = Math.atan2(dz, dx);
  let diff = attackerAngle - i.playerYawRadians;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  const halfAngle = (BLOCK_ANGLE_DEGREES / 2) * (Math.PI / 180);
  return Math.abs(diff) <= halfAngle;
}

export function projectileDeflected(i: BlockInput): boolean {
  return damageBlocked(i);
}
