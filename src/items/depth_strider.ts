// Depth Strider (boots). Reduces underwater-walking slowdown.

export const DEPTH_STRIDER_MAX = 3;

const UNDERWATER_BASE_SLOWDOWN = 0.5;

export function speedMultiplier(level: number): number {
  const eff = Math.max(0, Math.min(DEPTH_STRIDER_MAX, level));
  // At level 3, full land speed underwater.
  const restored =
    UNDERWATER_BASE_SLOWDOWN + (eff / DEPTH_STRIDER_MAX) * (1 - UNDERWATER_BASE_SLOWDOWN);
  return restored;
}

export function incompatibleWith(): string[] {
  return ['frost_walker'];
}
