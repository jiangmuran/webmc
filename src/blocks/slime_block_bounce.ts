// Slime block. Entities landing on it bounce with conserved velocity
// unless sneaking. Connects to pistons as a sticky movable assembly.
//
// Wiki (minecraft.wiki/w/Slime_Block): "Landing on a slime block does
// not cause fall damage regardless of whether the player is sneaking."
// And: "A player holding sneak takes no fall damage and does not
// bounce at all."
// (1.21.2 / MC-54532 closed this gap; pre-1.21.2 sneak landings
// did inflict fall damage, but webmc tracks current behavior.)
//
// Old preventsFallDamage(sneaking) returned !sneaking — i.e. sneaking
// landings still took fall damage, which has been a bug since 1.21.2.

export const SLIME_BOUNCE_RETENTION = 1.0;

export interface LandCtx {
  velocityY: number;
  sneaking: boolean;
}

export function landVelocity(c: LandCtx): number {
  if (c.sneaking) return 0;
  return -c.velocityY * SLIME_BOUNCE_RETENTION;
}

export function preventsFallDamage(_sneaking: boolean): boolean {
  return true;
}

export function pistonMovesAdjacent(): boolean {
  // Slime block drags adjacent moveable blocks with the piston.
  return true;
}

export function incompatibleWithHoneyDrag(): boolean {
  // Honey and slime do not stick to each other under piston motion.
  return true;
}
