export interface ProtectCtx {
  worldSpawnX: number;
  worldSpawnZ: number;
  protectionRadius: number;
  isHost: boolean;
}

export function canModifyAt(c: ProtectCtx, x: number, z: number): boolean {
  if (c.isHost) return true;
  const dx = x - c.worldSpawnX;
  const dz = z - c.worldSpawnZ;
  return Math.max(Math.abs(dx), Math.abs(dz)) > c.protectionRadius;
}

export function blockInteractAllowed(c: ProtectCtx, x: number, z: number): boolean {
  return canModifyAt(c, x, z);
}
