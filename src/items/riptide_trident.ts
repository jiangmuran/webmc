// Riptide (trident). Player launches forward when in water or rain
// while using the trident. Launch power scales with level.

export const RIPTIDE_MAX = 3;

export interface RiptideCtx {
  inWater: boolean; // submerged (head underwater)
  inRain: boolean;
  level: number;
  // Optional: standing in shallow water (feet wet but head not
  // submerged). Wiki distinguishes "in rain or standing in water"
  // vs "while underwater". Default false.
  standingInShallowWater?: boolean;
}

export function canLaunch(c: RiptideCtx): boolean {
  if (c.level <= 0) return false;
  return c.inWater || c.inRain || c.standingInShallowWater === true;
}

// Wiki (minecraft.wiki/w/Riptide): "The formula for the number of
// blocks the trident throws the user is (6 × level) + 3 when in
// rain or standing in water, and (4 × level) + 3 while underwater."
//
// Wiki distinguishes two contexts:
//   - Rain or standing on the surface of water (head NOT submerged):
//     velocity = 6 × level + 3 → 9 / 15 / 21 b/s at I / II / III
//   - Submerged (head underwater): velocity = 4 × level + 3
//     → 7 / 11 / 15 b/s at I / II / III
//
// `launchVelocityBps(level)` returns the rain/standing case for
// back-compat. `launchVelocityBpsFor(level, ctx)` picks the correct
// branch based on whether the player is submerged.
export function launchVelocityBps(level: number): number {
  return Math.max(0, Math.min(RIPTIDE_MAX, level)) * 6 + 3;
}

export function launchVelocityBpsFor(level: number, ctx: RiptideCtx): number {
  const lvl = Math.max(0, Math.min(RIPTIDE_MAX, level));
  // `inWater` here means "head submerged" — the slower underwater
  // formula. Rain or standing-in-shallow water is the surface case.
  if (ctx.inWater && !ctx.inRain && ctx.standingInShallowWater !== true) {
    return lvl * 4 + 3;
  }
  return lvl * 6 + 3;
}

export function trajectoryFactor(level: number): number {
  // Blocks per tick magnitude.
  return launchVelocityBps(level) / 20;
}

export function incompatibleWith(): string[] {
  return ['loyalty', 'channeling'];
}
