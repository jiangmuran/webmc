// Sprint FOV boost. Gently interpolates target FOV when sprint toggles;
// also used for speed-boosted states (trident riptide, elytra boost).

export interface FovState {
  baseFov: number;
  targetFov: number;
  currentFov: number;
}

export const SPRINT_FOV_MULT = 1.15;
export const SPEED_FOV_MULT_PER_LEVEL = 0.025;
export const FOV_LERP = 0.15;

export function targetFovFor(state: {
  baseFov: number;
  sprinting: boolean;
  speedAmplifier: number;
}): number {
  let t = state.baseFov;
  if (state.sprinting) t *= SPRINT_FOV_MULT;
  t *= 1 + state.speedAmplifier * SPEED_FOV_MULT_PER_LEVEL;
  return t;
}

export function tick(s: FovState): FovState {
  const delta = s.targetFov - s.currentFov;
  return { ...s, currentFov: s.currentFov + delta * FOV_LERP };
}

export function update(s: FovState, ctx: { sprinting: boolean; speedAmplifier: number }): FovState {
  const t = targetFovFor({ baseFov: s.baseFov, ...ctx });
  return tick({ ...s, targetFov: t });
}
