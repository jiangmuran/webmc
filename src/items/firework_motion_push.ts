export const ELYTRA_SPEED_PER_TICK = 0.33;

export function elytraFireworkAccel(lookVector: { x: number; y: number; z: number }): {
  dvx: number;
  dvy: number;
  dvz: number;
} {
  const len = Math.hypot(lookVector.x, lookVector.y, lookVector.z) || 1;
  return {
    dvx: (lookVector.x / len) * ELYTRA_SPEED_PER_TICK,
    dvy: (lookVector.y / len) * ELYTRA_SPEED_PER_TICK,
    dvz: (lookVector.z / len) * ELYTRA_SPEED_PER_TICK,
  };
}

// Wiki (minecraft.wiki/w/Firework_Rocket#Duration_and_direction):
// "Each firework determines its lifetime in ticks by 10 × (number
// of gunpowder + 1) + random value from 0 to 5 + random value from
// 0 to 6, after which it explodes." NBT spec confirms:
//   LifeTime = (Flight + 1) × 10 + random(0..5) + random(0..6)
// Old expression `... + Math.floor(Math.random() * 6 * 0)` had a
// stray `* 0` that zeroed the random component, so every flight
// duration produced a deterministic LifeTime — the wiki adds up to
// 11 extra ticks of variance which kept fireworks staggered when
// fired in rapid succession.
export function flightDurationTicks(
  flightDuration: 1 | 2 | 3,
  rand: () => number = Math.random,
): number {
  const r1 = Math.floor(rand() * 6); // 0..5
  const r2 = Math.floor(rand() * 7); // 0..6
  return (flightDuration + 1) * 10 + r1 + r2;
}
