// Riptide (trident). Player launches forward when in water or rain
// while using the trident. Launch power scales with level.

export const RIPTIDE_MAX = 3;

export interface RiptideCtx {
  inWater: boolean;
  inRain: boolean;
  level: number;
}

export function canLaunch(c: RiptideCtx): boolean {
  if (c.level <= 0) return false;
  return c.inWater || c.inRain;
}

export function launchVelocityBps(level: number): number {
  return Math.max(0, Math.min(RIPTIDE_MAX, level)) * 8 + 3;
}

export function trajectoryFactor(level: number): number {
  // Blocks per tick magnitude.
  return launchVelocityBps(level) / 20;
}

export function incompatibleWith(): string[] {
  return ['loyalty', 'channeling'];
}
