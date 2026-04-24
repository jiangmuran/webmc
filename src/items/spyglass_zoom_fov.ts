export const SPYGLASS_FOV = 5;
export const SPYGLASS_USE_TICKS_TO_FULL_ZOOM = 20;

export interface SpyglassUse {
  ticksHeld: number;
  active: boolean;
}

export function targetFov(use: SpyglassUse, baseFov: number): number {
  if (!use.active) return baseFov;
  const progress = Math.min(1, use.ticksHeld / SPYGLASS_USE_TICKS_TO_FULL_ZOOM);
  return baseFov * (1 - progress) + SPYGLASS_FOV * progress;
}

export function durability(_ticksHeld: number): number {
  return 1;
}

export function canTargetEnderDragon(ticksHeld: number): boolean {
  return ticksHeld >= SPYGLASS_USE_TICKS_TO_FULL_ZOOM;
}
