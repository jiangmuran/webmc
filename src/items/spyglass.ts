// Spyglass. Right-click holds a narrow FOV zoom; releasing returns to
// default. FOV multiplier is 0.1 (roughly 10x zoom).

export interface SpyglassState {
  active: boolean;
  fovMultiplier: number;
}

const ACTIVE_FOV = 0.1;
const DEFAULT_FOV = 1;

export function makeSpyglass(): SpyglassState {
  return { active: false, fovMultiplier: DEFAULT_FOV };
}

export function useSpyglass(state: SpyglassState): void {
  state.active = true;
  state.fovMultiplier = ACTIVE_FOV;
}

export function releaseSpyglass(state: SpyglassState): void {
  state.active = false;
  state.fovMultiplier = DEFAULT_FOV;
}
