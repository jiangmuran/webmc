// Honey block. Walking on top slows the player; attached to a wall, the
// player sticks and slides down slowly. Sticks to adjacent solid blocks
// when pushed by a piston (similar to slime but doesn't bounce).

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface VelocityInput {
  x: number;
  y: number;
  z: number;
}

export interface HoneyContact {
  onTop: boolean;
  onSide: boolean;
}

const TOP_SLOW = 0.4; // move at 40% speed on top of honey
const SIDE_SLIDE_Y = -0.05; // slow slide downward while attached
const Y_CAP = -0.05;

export function applyHoneyBlockModifiers(
  velocity: VelocityInput,
  contact: HoneyContact,
): VelocityInput {
  const next: VelocityInput = { ...velocity };
  if (contact.onTop) {
    next.x *= TOP_SLOW;
    next.z *= TOP_SLOW;
  }
  if (contact.onSide) {
    next.y = Math.max(next.y, Y_CAP);
    if (next.y < 0) next.y = SIDE_SLIDE_Y;
  }
  return next;
}

// Slime / honey distinction for pistons: slime drags non-solid stuck
// neighbors, honey drags only other honey.
export function stickinessCompatible(a: 'slime' | 'honey', b: 'slime' | 'honey'): boolean {
  return a === b;
}
