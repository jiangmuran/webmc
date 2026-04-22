// Entity tracker radius. Different entity types replicate to players
// within per-type ranges.

export type EntityClass =
  | 'player'
  | 'mob'
  | 'item'
  | 'xp_orb'
  | 'projectile'
  | 'minecart'
  | 'boat'
  | 'painting'
  | 'lightning';

const TRACK_RADIUS_BLOCKS: Record<EntityClass, number> = {
  player: 128,
  mob: 80,
  item: 64,
  xp_orb: 48,
  projectile: 64,
  minecart: 80,
  boat: 80,
  painting: 64,
  lightning: 256,
};

export function trackRadius(c: EntityClass): number {
  return TRACK_RADIUS_BLOCKS[c];
}

export function isInRange(
  ownerPos: { x: number; z: number },
  entityPos: { x: number; z: number },
  cls: EntityClass,
): boolean {
  const r = trackRadius(cls);
  const dx = ownerPos.x - entityPos.x;
  const dz = ownerPos.z - entityPos.z;
  return dx * dx + dz * dz <= r * r;
}

// Mobs despawn outside of soft cap range (32-128 blocks).
export const HARD_DESPAWN_DISTANCE = 128;
export const SOFT_DESPAWN_DISTANCE = 32;

export function shouldDespawn(mobDistance: number, ticksSinceLastPlayer: number): boolean {
  if (mobDistance > HARD_DESPAWN_DISTANCE) return true;
  if (mobDistance > SOFT_DESPAWN_DISTANCE && ticksSinceLastPlayer > 600) return true;
  return false;
}
