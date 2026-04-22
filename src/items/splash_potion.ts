// Splash + lingering potion. Splash potion is a thrown projectile that
// bursts on impact, applying its potion effect to every entity within
// 4 blocks (falloff by distance). Lingering potion creates a 30-second
// Area-of-Effect cloud that applies the effect over time.

import type { PotionEffect } from './potion';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export type PotionKind = 'splash' | 'lingering';

export interface PotionProjectile {
  kind: PotionKind;
  position: Vec3;
  velocity: Vec3;
  effects: readonly PotionEffect[];
  color: readonly [number, number, number];
  ageSec: number;
}

export function makePotionProjectile(
  kind: PotionKind,
  from: Vec3,
  velocity: Vec3,
  effects: readonly PotionEffect[],
  color: readonly [number, number, number] = [128, 128, 128],
): PotionProjectile {
  return { kind, position: { ...from }, velocity: { ...velocity }, effects, color, ageSec: 0 };
}

export interface PotionTickCtx {
  isSolid: (x: number, y: number, z: number) => boolean;
  dtSec: number;
}

export interface PotionTickResult {
  impacted: boolean;
  impactPos: Vec3 | null;
}

export function tickPotionProjectile(
  state: PotionProjectile,
  ctx: PotionTickCtx,
): PotionTickResult {
  state.ageSec += ctx.dtSec;
  state.position.x += state.velocity.x * ctx.dtSec;
  state.position.y += state.velocity.y * ctx.dtSec;
  state.position.z += state.velocity.z * ctx.dtSec;
  // Gravity + drag.
  state.velocity.y -= 20 * ctx.dtSec;
  state.velocity.x *= 0.99;
  state.velocity.z *= 0.99;
  const block = {
    x: Math.floor(state.position.x),
    y: Math.floor(state.position.y),
    z: Math.floor(state.position.z),
  };
  if (ctx.isSolid(block.x, block.y, block.z)) {
    return { impacted: true, impactPos: state.position };
  }
  return { impacted: false, impactPos: null };
}

// Splash impact: for each entity within 4 blocks, compute diminished
// effect duration (full at origin, 0 at 4 blocks).
export interface SplashTarget {
  id: number;
  position: Vec3;
}

export interface SplashApply {
  entityId: number;
  effects: readonly PotionEffect[];
}

export function splashApply(
  impactPos: Vec3,
  effects: readonly PotionEffect[],
  targets: readonly SplashTarget[],
): SplashApply[] {
  const out: SplashApply[] = [];
  for (const t of targets) {
    const dx = t.position.x - impactPos.x;
    const dy = t.position.y - impactPos.y;
    const dz = t.position.z - impactPos.z;
    const dist = Math.hypot(dx, dy, dz);
    if (dist > 4) continue;
    const factor = 1 - dist / 4;
    const scaled = effects.map((eff) => ({
      id: eff.id,
      amplifier: eff.amplifier,
      durationSec: eff.durationSec * factor,
    }));
    out.push({ entityId: t.id, effects: scaled });
  }
  return out;
}
