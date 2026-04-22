// Lingering cloud — Area-of-Effect created by a lingering potion or
// dragon breath. Lasts ~30s, shrinks over time, applies its effect every
// 0.5s (every 10 ticks) to entities standing inside.

import type { PotionEffect } from '@/items/potion';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface LingeringCloud {
  position: Vec3;
  effects: readonly PotionEffect[];
  radius: number;
  remainingSec: number;
  applyCooldownSec: number;
}

const MAX_RADIUS = 3;
const DEFAULT_LIFETIME_SEC = 30;
const APPLY_INTERVAL_SEC = 0.5;

export function makeLingeringCloud(
  position: Vec3,
  effects: readonly PotionEffect[],
  lifetimeSec = DEFAULT_LIFETIME_SEC,
): LingeringCloud {
  return {
    position: { ...position },
    effects,
    radius: MAX_RADIUS,
    remainingSec: lifetimeSec,
    applyCooldownSec: 0,
  };
}

export interface CloudTarget {
  id: number;
  position: Vec3;
}

export interface CloudApply {
  entityId: number;
  effects: readonly PotionEffect[];
}

export interface CloudTickResult {
  expired: boolean;
  applied: readonly CloudApply[];
}

export function tickCloud(
  state: LingeringCloud,
  dtSec: number,
  targets: readonly CloudTarget[],
): CloudTickResult {
  state.remainingSec -= dtSec;
  state.applyCooldownSec = Math.max(0, state.applyCooldownSec - dtSec);
  state.radius = MAX_RADIUS * Math.max(0, state.remainingSec / DEFAULT_LIFETIME_SEC);
  if (state.remainingSec <= 0) {
    return { expired: true, applied: [] };
  }
  if (state.applyCooldownSec > 0) {
    return { expired: false, applied: [] };
  }
  state.applyCooldownSec = APPLY_INTERVAL_SEC;
  const rSq = state.radius * state.radius;
  const applied: CloudApply[] = [];
  for (const t of targets) {
    const dx = t.position.x - state.position.x;
    const dy = t.position.y - state.position.y;
    const dz = t.position.z - state.position.z;
    if (dx * dx + dy * dy + dz * dz <= rSq) {
      applied.push({
        entityId: t.id,
        effects: state.effects.map((e) => ({ ...e, durationSec: e.durationSec / 4 })),
      });
    }
  }
  return { expired: false, applied };
}
