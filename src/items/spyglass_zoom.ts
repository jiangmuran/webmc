// Spyglass use. Right-click to raise and zoom. FOV smoothly
// interpolates from current to target; releasing restores previous FOV.

export interface SpyglassState {
  raised: boolean;
  currentFov: number;
  savedFov: number;
}

export const ZOOM_FOV = 10; // degrees
export const FOV_LERP = 0.2;

export function makeSpyglass(defaultFov: number): SpyglassState {
  return { raised: false, currentFov: defaultFov, savedFov: defaultFov };
}

export function raise(s: SpyglassState, baseFov: number): void {
  if (s.raised) return;
  s.raised = true;
  s.savedFov = baseFov;
}

export function lower(s: SpyglassState): void {
  s.raised = false;
}

export function tickFov(s: SpyglassState): void {
  const target = s.raised ? ZOOM_FOV : s.savedFov;
  s.currentFov = s.currentFov + (target - s.currentFov) * FOV_LERP;
}

// Player can't sprint or attack while raised.
export function blocksSprint(s: SpyglassState): boolean {
  return s.raised;
}
