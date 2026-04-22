// Striders walk safely on lava. Shiver (slower) out of lava / in rain.
// Saddle + warped fungus on stick = rideable with steering.

export interface StriderCtx {
  inLava: boolean;
  inRain: boolean;
  saddled: boolean;
  rider: string | null;
}

export const STRIDER_LAVA_SPEED = 0.35;
export const STRIDER_LAND_SPEED = 0.17;

export function currentSpeed(c: StriderCtx): number {
  if (c.inRain) return STRIDER_LAND_SPEED * 0.5;
  return c.inLava ? STRIDER_LAVA_SPEED : STRIDER_LAND_SPEED;
}

export function damagedOutsideLava(_c: StriderCtx): boolean {
  // Striders shiver but do not take damage; only fall damage + drowning (in water).
  return false;
}

export function canSteer(c: StriderCtx): boolean {
  return c.saddled && c.rider !== null;
}

export function immuneToLava(): boolean {
  return true;
}
