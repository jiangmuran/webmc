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

// Wiki (minecraft.wiki/w/Riptide): "The formula for the number of
// blocks the trident throws the user is (6 × level) + 3 when in
// rain or standing in water, and (4 × level) + 3 while underwater."
// This launches the rain/water case (the common Riptide trigger);
// the underwater case is left as a TODO once the launch context
// distinguishes submerged vs surface. Old `level * 8 + 3` (11/19/27
// at level I/II/III) was 33–28% high vs the wiki's 9/15/21.
export function launchVelocityBps(level: number): number {
  return Math.max(0, Math.min(RIPTIDE_MAX, level)) * 6 + 3;
}

export function trajectoryFactor(level: number): number {
  // Blocks per tick magnitude.
  return launchVelocityBps(level) / 20;
}

export function incompatibleWith(): string[] {
  return ['loyalty', 'channeling'];
}
