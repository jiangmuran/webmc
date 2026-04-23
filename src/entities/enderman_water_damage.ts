// Endermen take damage in water and from rain; teleport away from it.

export const ENDERMAN_WATER_DAMAGE_PER_TICK = 1;
export const TELEPORT_ATTEMPT_RADIUS = 32;

export interface EndermanCtx {
  inWater: boolean;
  inRain: boolean;
  hovered: boolean;
}

export function damagePerTick(c: EndermanCtx): number {
  if (c.inWater || c.inRain) return ENDERMAN_WATER_DAMAGE_PER_TICK;
  return 0;
}

export function shouldTeleportAway(c: EndermanCtx): boolean {
  return c.inWater || c.inRain;
}

export function triggersOnStareBlock(hovered: boolean): boolean {
  return hovered;
}

export function teleportRadius(): number {
  return TELEPORT_ATTEMPT_RADIUS;
}
