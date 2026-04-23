// Pig riding with saddle and carrot-on-a-stick for steering.

export interface PigCtx {
  saddled: boolean;
  rider: string | null;
  usingCarrot: boolean;
}

export const PIG_BASE_SPEED = 0.2;
export const PIG_BOOST_SPEED = 0.4;

export function canSteer(c: PigCtx): boolean {
  return c.saddled && c.rider !== null;
}

export function effectiveSpeed(c: PigCtx): number {
  if (!canSteer(c)) return PIG_BASE_SPEED;
  return c.usingCarrot ? PIG_BOOST_SPEED : PIG_BASE_SPEED;
}

export function carrotUses(maxUses = 7): number {
  return maxUses;
}
