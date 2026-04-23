// Spyglass aim-down-sight. Reduces FOV + rounds the viewport border.

export const SPYGLASS_FOV_DEG = 11;
export const SPYGLASS_SENSITIVITY_MULT = 0.16;

export interface SpyglassCtx {
  using: boolean;
  baseFov: number;
  baseSensitivity: number;
}

export function effectiveFov(c: SpyglassCtx): number {
  return c.using ? SPYGLASS_FOV_DEG : c.baseFov;
}

export function effectiveSensitivity(c: SpyglassCtx): number {
  return c.using ? c.baseSensitivity * SPYGLASS_SENSITIVITY_MULT : c.baseSensitivity;
}

export function durabilityCostPerUse(): number {
  return 0;
}
