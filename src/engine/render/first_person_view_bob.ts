export const VIEW_BOB_ENABLED_DEFAULT = true;
export const MAX_BOB_AMPLITUDE = 0.1;

export interface ViewBobInput {
  walkSpeed: number;
  onGround: boolean;
  ticks: number;
  enabled: boolean;
}

export function bobOffset(i: ViewBobInput): { dx: number; dy: number; dz: number } {
  if (!i.enabled || !i.onGround) return { dx: 0, dy: 0, dz: 0 };
  const amplitude = Math.min(MAX_BOB_AMPLITUDE, i.walkSpeed * 0.3);
  return {
    dx: Math.sin(i.ticks / 5) * amplitude * 0.5,
    dy: Math.abs(Math.sin(i.ticks / 5)) * amplitude * -0.5,
    dz: 0,
  };
}

export function damageBobIntensity(healthFraction: number): number {
  return Math.max(0, 1 - healthFraction) * 0.3;
}
