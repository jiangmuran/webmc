// Trident riptide launch + landing damage calc.
//
// Wiki (minecraft.wiki/w/Riptide): "(6 × level) + 3 when in rain
// or standing in water." Old `level * 2 + 3` gave 5/7/9 at I/II/III
// vs wiki 9/15/21 — at level III the player launched 12 blocks
// short. Sibling riptide_trident.ts now uses the same formula.
export const RIPTIDE_MIN_LAUNCH = 3;
export const RIPTIDE_PER_LEVEL = 6;

export interface RiptideCtx {
  level: number;
  pitchRad: number;
  yawRad: number;
}

export function launchVelocity(c: RiptideCtx): { vx: number; vy: number; vz: number } {
  const speed = RIPTIDE_MIN_LAUNCH + c.level * RIPTIDE_PER_LEVEL;
  const cp = Math.cos(c.pitchRad);
  const sp = Math.sin(c.pitchRad);
  const cy = Math.cos(c.yawRad);
  const sy = Math.sin(c.yawRad);
  return { vx: -sy * cp * speed, vy: -sp * speed, vz: cy * cp * speed };
}

export function cancelsFallDamageOnLaunch(): boolean {
  return true;
}

export function damageToMobsInPath(c: RiptideCtx): number {
  return 8 + c.level * 1.5;
}
