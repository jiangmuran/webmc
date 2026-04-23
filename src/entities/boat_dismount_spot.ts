// When player dismounts a boat, find a safe landing spot within the
// surrounding cells (prefer shore side). Mobs eject similarly.

export interface LandingCandidate {
  x: number;
  y: number;
  z: number;
  safe: boolean;
  onShore: boolean;
}

export function pickLanding(candidates: LandingCandidate[]): LandingCandidate | null {
  const safe = candidates.filter((c) => c.safe);
  if (safe.length === 0) return null;
  const shore = safe.filter((c) => c.onShore);
  if (shore.length > 0) return shore[0] ?? null;
  return safe[0] ?? null;
}

export function defaultSearchRadius(): number {
  return 2;
}
