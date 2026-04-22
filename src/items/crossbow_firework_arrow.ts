// Crossbow-fired fireworks. A firework rocket loaded into a crossbow
// replaces the arrow; it travels in a straight line (no arc) and
// detonates on impact or after ~1.5 seconds, dealing AoE damage based
// on its star count. Multishot can fire 3 fireworks at once.

import type { FireworkStarDef } from './firework_damage';

export interface CrossbowFirework {
  item: 'webmc:firework_rocket';
  stars: readonly FireworkStarDef[];
  flightDuration: 1 | 2 | 3;
}

export function isFireworkAmmo(item: { item?: string }): item is CrossbowFirework {
  return item.item === 'webmc:firework_rocket';
}

export interface FireworkFireQuery {
  rocket: CrossbowFirework;
  multishotLevel: number;
  baseDir: { x: number; y: number; z: number };
  baseVelocity: number;
}

export interface FireworkLaunchResult {
  projectiles: readonly {
    velocity: { x: number; y: number; z: number };
    stars: readonly FireworkStarDef[];
    detonationSec: number;
  }[];
}

const MULTISHOT_YAW_SPREAD_RAD = (10 * Math.PI) / 180;

export function launchFireworks(q: FireworkFireQuery): FireworkLaunchResult {
  const count = q.multishotLevel > 0 ? 3 : 1;
  const detonation = q.rocket.flightDuration * 0.5;
  const magnitude = Math.hypot(q.baseDir.x, q.baseDir.y, q.baseDir.z) || 1;
  const ux = q.baseDir.x / magnitude;
  const uy = q.baseDir.y / magnitude;
  const uz = q.baseDir.z / magnitude;

  const projectiles: {
    velocity: { x: number; y: number; z: number };
    stars: readonly FireworkStarDef[];
    detonationSec: number;
  }[] = [];
  for (let i = 0; i < count; i++) {
    const yaw = i === 0 ? 0 : i === 1 ? -MULTISHOT_YAW_SPREAD_RAD : MULTISHOT_YAW_SPREAD_RAD;
    const cos = Math.cos(yaw);
    const sin = Math.sin(yaw);
    const rx = ux * cos + uz * sin;
    const rz = -ux * sin + uz * cos;
    projectiles.push({
      velocity: {
        x: rx * q.baseVelocity,
        y: uy * q.baseVelocity,
        z: rz * q.baseVelocity,
      },
      stars: q.rocket.stars,
      detonationSec: detonation,
    });
  }
  return { projectiles };
}

// Crossbow fireworks deal base damage + per-star damage on impact.
// Piercing enchant cannot pierce firework rockets — they always detonate.
export function fireworkIgnoresPiercing(): boolean {
  return true;
}
