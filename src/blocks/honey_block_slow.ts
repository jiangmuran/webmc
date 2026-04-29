// Honey block physics. Entities on top slow down ~60% and slide down
// side walls slowly. Jumping off a honey block gives reduced jump.

export interface HoneyContact {
  standingOnTop: boolean;
  touchingSide: boolean;
}

export const ON_TOP_SPEED_MULT = 0.4;
export const ON_TOP_JUMP_MULT = 0.5;
export const SIDE_SLIDE_VELOCITY_Y = -0.05;

export function speedMultiplier(c: HoneyContact): number {
  return c.standingOnTop ? ON_TOP_SPEED_MULT : 1;
}

export function jumpMultiplier(c: HoneyContact): number {
  return c.standingOnTop ? ON_TOP_JUMP_MULT : 1;
}

export function slideYVelocity(c: HoneyContact): number {
  return c.touchingSide ? SIDE_SLIDE_VELOCITY_Y : 0;
}

// Falling onto honey: fall damage is reduced by 80%.
export const HONEY_FALL_DAMAGE_MULT = 0.2;

export function applyHoneyFallDamage(baseDamage: number): number {
  return Math.floor(baseDamage * HONEY_FALL_DAMAGE_MULT);
}

// Wiki: honey blocks stick to other honey blocks but explicitly do
// NOT stick to slime blocks (the famous piston trick — slime+honey
// adjacency lets one push past the other for selective designs). Was
// incorrectly treating slime_block as sticky.
export function stickyConnection(other: string): boolean {
  return other === 'webmc:honey_block';
}
