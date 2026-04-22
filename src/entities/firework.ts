// Firework rockets. Launch at ~2s lifetime, adding duration from each
// gunpowder component. With an elytra player, applies a forward boost for
// the duration of the firework.

export interface FireworkComponent {
  gunpowderCount: number; // 1-3, each adds ~1s lifetime + altitude
  starColors?: readonly (readonly [number, number, number])[];
  fade?: boolean;
  trail?: boolean;
  flicker?: boolean;
  shape?: 'small' | 'large' | 'star' | 'creeper' | 'burst';
}

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface FireworkRocket {
  id: number;
  position: Vec3;
  velocity: Vec3;
  lifetimeSec: number;
  ageSec: number;
  boostPlayerId: number | null; // if launched by an elytra player
}

export function rocketLifetime(c: FireworkComponent): number {
  // MC: 1 + gunpowder + rand(0,1) seconds.
  return 1 + Math.max(1, Math.min(3, c.gunpowderCount)) * 0.5;
}

export function makeRocket(
  component: FireworkComponent,
  start: Vec3,
  boostPlayerId: number | null = null,
): FireworkRocket {
  return {
    id: 0,
    position: { ...start },
    velocity: { x: 0, y: 3, z: 0 },
    lifetimeSec: rocketLifetime(component),
    ageSec: 0,
    boostPlayerId,
  };
}

export interface RocketTickResult {
  detonated: boolean;
  boostVelocity: Vec3 | null; // velocity to apply to the owner's elytra flight
}

export function tickRocket(r: FireworkRocket, dtSec: number): RocketTickResult {
  r.ageSec += dtSec;
  r.position.x += r.velocity.x * dtSec;
  r.position.y += r.velocity.y * dtSec;
  r.position.z += r.velocity.z * dtSec;
  // Rockets have a gentle upward thrust rather than gravity.
  r.velocity.y += 2 * dtSec;
  r.velocity.x *= 0.995;
  r.velocity.z *= 0.995;

  const boost =
    r.boostPlayerId !== null
      ? { x: r.velocity.x * 1.5, y: r.velocity.y * 0.5, z: r.velocity.z * 1.5 }
      : null;
  return { detonated: r.ageSec >= r.lifetimeSec, boostVelocity: boost };
}
