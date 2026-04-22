// Phantom flight pattern. A phantom circles its target at a fixed
// radius, occasionally swooping to attack. States: circling, swooping,
// retreating. Angular velocity, altitude, and swoop trigger are all
// modeled here.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export type PhantomPhase = 'circling' | 'swooping' | 'retreating';

export interface PhantomState {
  phase: PhantomPhase;
  center: Vec3;
  radius: number;
  altitude: number;
  angleRad: number;
  angularSpeed: number; // rad/s
  swoopCooldownSec: number;
  position: Vec3;
  velocity: Vec3;
  targetPos: Vec3 | null;
}

export function makePhantom(at: Vec3, target: Vec3): PhantomState {
  return {
    phase: 'circling',
    center: { ...target },
    radius: 15,
    altitude: 20,
    angleRad: 0,
    angularSpeed: 0.5,
    swoopCooldownSec: 3,
    position: { ...at },
    velocity: { x: 0, y: 0, z: 0 },
    targetPos: null,
  };
}

export interface PhantomTickCtx {
  playerPos: Vec3 | null;
  dtSec: number;
}

export interface PhantomTickResult {
  swoopStarted: boolean;
}

export function tickPhantom(state: PhantomState, ctx: PhantomTickCtx): PhantomTickResult {
  if (!ctx.playerPos) return { swoopStarted: false };
  state.center = { x: ctx.playerPos.x, y: ctx.playerPos.y, z: ctx.playerPos.z };

  if (state.phase === 'circling') {
    state.angleRad += state.angularSpeed * ctx.dtSec;
    state.position = {
      x: state.center.x + Math.cos(state.angleRad) * state.radius,
      y: state.center.y + state.altitude,
      z: state.center.z + Math.sin(state.angleRad) * state.radius,
    };
    state.swoopCooldownSec = Math.max(0, state.swoopCooldownSec - ctx.dtSec);
    if (state.swoopCooldownSec === 0) {
      state.phase = 'swooping';
      state.targetPos = { ...ctx.playerPos };
      return { swoopStarted: true };
    }
  } else if (state.phase === 'swooping') {
    const t = state.targetPos;
    if (!t) {
      state.phase = 'circling';
      return { swoopStarted: false };
    }
    const dx = t.x - state.position.x;
    const dy = t.y - state.position.y;
    const dz = t.z - state.position.z;
    const dist = Math.hypot(dx, dy, dz);
    if (dist < 1) {
      state.phase = 'retreating';
      return { swoopStarted: false };
    }
    const speed = 15;
    state.position.x += (dx / dist) * speed * ctx.dtSec;
    state.position.y += (dy / dist) * speed * ctx.dtSec;
    state.position.z += (dz / dist) * speed * ctx.dtSec;
  } else {
    const rdx = state.center.x - state.position.x;
    const rdz = state.center.z - state.position.z;
    const rdist = Math.hypot(rdx, rdz);
    if (rdist >= state.radius) {
      state.phase = 'circling';
      state.swoopCooldownSec = 5 + Math.random() * 3;
    }
    state.position.y += 5 * ctx.dtSec;
  }
  return { swoopStarted: false };
}

// Phantoms burn in sunlight (see mob_burn_in_sun.ts).
