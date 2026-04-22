// Slime block. Entities landing on it bounce with conserved velocity
// unless sneaking. Connects to pistons as a sticky movable assembly.

export const SLIME_BOUNCE_RETENTION = 1.0;

export interface LandCtx {
  velocityY: number;
  sneaking: boolean;
}

export function landVelocity(c: LandCtx): number {
  if (c.sneaking) return 0;
  return -c.velocityY * SLIME_BOUNCE_RETENTION;
}

export function preventsFallDamage(sneaking: boolean): boolean {
  return !sneaking;
}

export function pistonMovesAdjacent(): boolean {
  // Slime block drags adjacent moveable blocks with the piston.
  return true;
}

export function incompatibleWithHoneyDrag(): boolean {
  // Honey and slime do not stick to each other under piston motion.
  return true;
}
