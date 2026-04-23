export interface NametagCtx {
  entityY: number;
  headHeight: number;
  cameraDistance: number;
  alwaysVisible: boolean;
  isPlayer: boolean;
}

export const MAX_NAMETAG_DISTANCE = 64;

export function shouldRender(c: NametagCtx): boolean {
  if (c.alwaysVisible) return true;
  return c.cameraDistance <= MAX_NAMETAG_DISTANCE;
}

export function anchorY(c: NametagCtx): number {
  return c.entityY + c.headHeight + 0.5;
}

export function opacityForDistance(c: NametagCtx): number {
  if (c.cameraDistance >= MAX_NAMETAG_DISTANCE) return 0;
  return 1 - c.cameraDistance / MAX_NAMETAG_DISTANCE;
}
