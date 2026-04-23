// First-person camera walk bob. Offsets camera based on accumulated
// distance walked, modulated by hand-height preference.

export interface WalkBobState {
  distanceWalked: number;
  strength: number;
}

export function initBob(strength = 1): WalkBobState {
  return { distanceWalked: 0, strength };
}

export function accumulate(
  s: WalkBobState,
  dx: number,
  dz: number,
  onGround: boolean,
): WalkBobState {
  if (!onGround) return s;
  const d = Math.hypot(dx, dz);
  return { ...s, distanceWalked: s.distanceWalked + d };
}

export function offsetY(s: WalkBobState): number {
  return Math.abs(Math.sin(s.distanceWalked * Math.PI)) * 0.05 * s.strength;
}

export function offsetX(s: WalkBobState): number {
  return Math.sin(s.distanceWalked * Math.PI) * 0.03 * s.strength;
}

export function setStrength(s: WalkBobState, strength: number): WalkBobState {
  return { ...s, strength: Math.max(0, Math.min(1, strength)) };
}
