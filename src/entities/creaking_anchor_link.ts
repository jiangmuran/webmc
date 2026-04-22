// Creaking + Creaking Heart. A creaking is bound to a creaking-heart
// block within a 32-block cube. Damage dealt to the creaking is
// reflected: only hurts when the heart is hurt; destroying the heart
// kills all linked creakings.

export interface CreakingHeart {
  pos: { x: number; y: number; z: number };
  hp: number;
  maxHp: number;
  boundCreakingIds: Set<string>;
}

export const LINK_RADIUS = 32;
export const HEART_MAX_HP = 6;

export function makeHeart(pos: { x: number; y: number; z: number }): CreakingHeart {
  return { pos, hp: HEART_MAX_HP, maxHp: HEART_MAX_HP, boundCreakingIds: new Set() };
}

export function isLinkable(
  heart: CreakingHeart,
  creakingPos: { x: number; y: number; z: number },
): boolean {
  return (
    Math.abs(heart.pos.x - creakingPos.x) <= LINK_RADIUS &&
    Math.abs(heart.pos.y - creakingPos.y) <= LINK_RADIUS &&
    Math.abs(heart.pos.z - creakingPos.z) <= LINK_RADIUS
  );
}

export interface DamageQuery {
  damage: number;
}

// Damage to a linked creaking is absorbed by the heart.
export function damageThroughLink(heart: CreakingHeart, q: DamageQuery): { killed: boolean } {
  heart.hp = Math.max(0, heart.hp - q.damage);
  return { killed: heart.hp === 0 };
}

export function onHeartDestroyed(heart: CreakingHeart): string[] {
  const ids = [...heart.boundCreakingIds];
  heart.boundCreakingIds.clear();
  return ids;
}

// Creakings only move when no one is looking at them (like weeping
// angels). Exposed as a boolean for AI step.
export function canMove(anyPlayerLooking: boolean): boolean {
  return !anyPlayerLooking;
}
