// Ice friction. Standing on ice reduces ground friction from the normal
// 0.6 to 0.98 (closer to 1 = less deceleration). Packed ice is 0.98 as
// well; blue ice is 0.99 (nearly frictionless). Soul sand and magma are
// special slow surfaces (0.4, 0.5).

export type GroundBlock =
  | 'ice'
  | 'packed_ice'
  | 'blue_ice'
  | 'frosted_ice'
  | 'soul_sand'
  | 'soul_soil'
  | 'slime_block'
  | 'honey_block'
  | 'default';

const FRICTION: Record<GroundBlock, number> = {
  ice: 0.98,
  packed_ice: 0.98,
  blue_ice: 0.99,
  frosted_ice: 0.98,
  soul_sand: 0.4,
  soul_soil: 0.5,
  slime_block: 0.8,
  honey_block: 0.4,
  default: 0.6,
};

export function frictionOf(block: GroundBlock): number {
  return FRICTION[block];
}

// Apply friction to horizontal velocity after a tick. MC formula:
//   vx *= friction * 0.91  (the 0.91 is "air resistance")
export function applyFriction(
  velocity: { x: number; y: number; z: number },
  block: GroundBlock,
): { x: number; y: number; z: number } {
  const f = FRICTION[block] * 0.91;
  return { x: velocity.x * f, y: velocity.y, z: velocity.z * f };
}

// Momentum bonus for sprinting on ice is roughly +30% compared to
// concrete; this helper gives a speed-cap multiplier for animation +
// physics clamp purposes.
export function speedCapMultiplier(block: GroundBlock): number {
  if (block === 'blue_ice') return 1.6;
  if (block === 'ice' || block === 'packed_ice' || block === 'frosted_ice') return 1.3;
  return 1;
}

// Boats move WAY faster on blue ice (up to 72 m/s). Track a separate
// boat friction table.
const BOAT_FRICTION: Record<GroundBlock, number> = {
  ...FRICTION,
  ice: 0.98,
  packed_ice: 0.98,
  blue_ice: 0.995,
  frosted_ice: 0.98,
  soul_sand: 0.6,
  soul_soil: 0.6,
  slime_block: 0.6,
  honey_block: 0.6,
  default: 0.6,
};

export function boatFrictionOf(block: GroundBlock): number {
  return BOAT_FRICTION[block];
}
