export const MIN_FOV = 10;
export const MAX_FOV = 70;
export const DEFAULT_SCOPE_FOV = 10;

export function zoomedFov(defaultFov: number, zoomActive: boolean): number {
  if (!zoomActive) return defaultFov;
  return Math.max(MIN_FOV, Math.min(MAX_FOV, DEFAULT_SCOPE_FOV));
}

export function showsScopeOverlay(zoomActive: boolean): boolean {
  return zoomActive;
}
