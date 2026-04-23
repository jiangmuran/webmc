export interface TiltInput {
  attackerX: number;
  attackerZ: number;
  playerX: number;
  playerZ: number;
  playerYaw: number;
}

export function damageTiltAngle(i: TiltInput): number {
  const dx = i.attackerX - i.playerX;
  const dz = i.attackerZ - i.playerZ;
  const world = Math.atan2(dz, dx);
  const rel = world - i.playerYaw;
  return Math.atan2(Math.sin(rel), Math.cos(rel));
}
