export interface CreakingCtx {
  isLinkedToHeart: boolean;
  heartBroken: boolean;
  playerLookingAt: boolean;
}

export function cannotMove(c: CreakingCtx): boolean {
  return c.playerLookingAt;
}

export function diesOnHeartBreak(c: CreakingCtx): boolean {
  return c.isLinkedToHeart && c.heartBroken;
}

export function invulnerableWhileLinked(c: CreakingCtx): boolean {
  return c.isLinkedToHeart && !c.heartBroken;
}
