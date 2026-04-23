// Elytra pitch control. Diving gains speed; climbing loses it. Firework
// rocket grants forward impulse for ~2s.

export interface ElytraCtx {
  pitchRad: number;
  speed: number;
  rocketTicksRemaining: number;
}

export const ROCKET_BOOST_SPEED = 1.5;
export const GLIDE_DRAG = 0.99;

export function glideStep(c: ElytraCtx): ElytraCtx {
  const next: ElytraCtx = { ...c };
  if (c.rocketTicksRemaining > 0) {
    next.speed = Math.min(ROCKET_BOOST_SPEED, c.speed + 0.04);
    next.rocketTicksRemaining = c.rocketTicksRemaining - 1;
  } else {
    const diveBoost = Math.sin(c.pitchRad) * 0.02;
    next.speed = Math.max(0, (c.speed + diveBoost) * GLIDE_DRAG);
  }
  return next;
}

export function startRocketBoost(c: ElytraCtx, durationTicks: number): ElytraCtx {
  return { ...c, rocketTicksRemaining: durationTicks };
}

export function hasRocketBoost(c: ElytraCtx): boolean {
  return c.rocketTicksRemaining > 0;
}
