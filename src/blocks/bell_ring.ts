// Village bell. Rings when right-clicked or powered with redstone.
//
// Wiki (minecraft.wiki/w/Bell#Glowing_effect): "If a bell is rung
// and there is a raid mob within a 32 block spherical range, the
// Glowing effect is applied to all raid mobs within 48 blocks for
// 3 seconds." Two distinct radii — TRIGGER 32 (any raider in range
// to fire the effect) and APPLY 48 (the actual glow reach once
// triggered).
//
// Old code applied glow only within 32 blocks, missing raiders in
// the 32-48 shell that wiki canon highlights. Sibling
// bell_ring_damage_raiders.ts already implements this distinction.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface BellState {
  ringing: boolean;
  secondsSinceRing: number;
  swingAngle: number;
}

export function makeBell(): BellState {
  return { ringing: false, secondsSinceRing: 0, swingAngle: 0 };
}

export const BELL_RAIDER_TRIGGER_RADIUS = 32;
export const BELL_RAIDER_GLOW_RADIUS = 48;
export const BELL_GLOWING_SEC = 3;
export const BELL_SOUND_RADIUS = 24;
export const BELL_RING_DURATION_SEC = 1;

export function ringBell(state: BellState): void {
  state.ringing = true;
  state.secondsSinceRing = 0;
  state.swingAngle = 0;
}

export function tickBell(state: BellState, dtSec: number): void {
  if (!state.ringing) return;
  state.secondsSinceRing += dtSec;
  // Pendulum swing: simple damped oscillation.
  state.swingAngle = Math.cos(state.secondsSinceRing * 6) * Math.exp(-state.secondsSinceRing * 2);
  if (state.secondsSinceRing >= BELL_RING_DURATION_SEC) {
    state.ringing = false;
    state.swingAngle = 0;
  }
}

export interface RingContext {
  bellPos: Vec3;
  raiders: readonly { id: number; position: Vec3; isRaider: boolean }[];
}

export interface RingEffect {
  glowingRaiderIds: readonly number[];
  soundsTo: readonly number[]; // entity ids to play sound for (within sound radius)
}

export function computeRingEffect(ctx: RingContext): RingEffect {
  const sounds: number[] = [];
  // Pass 1: detect any raider within trigger radius — required to fire.
  let triggered = false;
  for (const r of ctx.raiders) {
    const dx = r.position.x - ctx.bellPos.x;
    const dy = r.position.y - ctx.bellPos.y;
    const dz = r.position.z - ctx.bellPos.z;
    const dist = Math.hypot(dx, dy, dz);
    if (r.isRaider && dist <= BELL_RAIDER_TRIGGER_RADIUS) {
      triggered = true;
    }
    if (dist <= BELL_SOUND_RADIUS) sounds.push(r.id);
  }
  // Pass 2: if triggered, glow ALL raiders within the wider apply radius.
  const glowing: number[] = [];
  if (triggered) {
    for (const r of ctx.raiders) {
      if (!r.isRaider) continue;
      const dx = r.position.x - ctx.bellPos.x;
      const dy = r.position.y - ctx.bellPos.y;
      const dz = r.position.z - ctx.bellPos.z;
      if (Math.hypot(dx, dy, dz) <= BELL_RAIDER_GLOW_RADIUS) glowing.push(r.id);
    }
  }
  return { glowingRaiderIds: glowing, soundsTo: sounds };
}

// Villager schedule transitions triggered by the bell (noon chime):
// work→gather→home, roughly.
export type VillagerSchedule = 'work' | 'gather' | 'home' | 'sleep';

export function onBellChime(current: VillagerSchedule): VillagerSchedule {
  switch (current) {
    case 'work':
      return 'gather';
    case 'gather':
      return 'home';
    case 'home':
      return 'work';
    case 'sleep':
      return 'work';
  }
}
