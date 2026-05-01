export interface ZombieDrownCtx {
  underwaterTicks: number;
  headInWater: boolean;
}

// Wiki (minecraft.wiki/w/Zombie#Drowning): "Zombies, husks, and
// zombie villagers slowly convert to a drowned when their head is
// fully submerged in water for at least 30 seconds. After this
// period, they shake for 15 seconds before becoming a drowned."
//
// So:
//   t in [0, 600)   — submerged but not yet converting
//   t in [600, 900) — visibly shaking
//   t >= 900        — convert to drowned
//
// Old CONVERT_TICKS = 600 conflated the 30-s wait with the full
// conversion time, and `shakesWhileConverting` fired at t = 300
// (the *halfway* point of the wait), which is neither when the
// wait starts NOR when the shake starts. The 15-s shake animation
// kicks in AFTER the 30-s wait, not halfway through it. Net effect:
// in code a zombie became drowned at t=600 (15 s before canon) and
// the shake animation started 15 s before any wiki event would.
export const SHAKE_START_TICKS = 600; // 30 s submerged → start shake
export const CONVERT_TICKS = 900; // 30 s + 15 s shake → drowned

export function shouldConvert(c: ZombieDrownCtx): boolean {
  return c.headInWater && c.underwaterTicks >= CONVERT_TICKS;
}

export function convertedTo(): string {
  return 'drowned';
}

export function shakesWhileConverting(c: ZombieDrownCtx): boolean {
  return c.headInWater && c.underwaterTicks >= SHAKE_START_TICKS;
}
