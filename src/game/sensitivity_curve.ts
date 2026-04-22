// Mouse sensitivity curve. MC uses: factor = (sens * 0.6 + 0.2)^3 * 1.2.
// So a slider value (0..2) maps to an actual rotation-per-pixel gain.

export function sensitivityGain(slider: number): number {
  const s = Math.max(0, Math.min(2, slider)) / 2; // normalize to 0..1
  const f = s * 0.6 + 0.2;
  return f * f * f * 1.2;
}

export interface LookDelta {
  dxPx: number;
  dyPx: number;
}

export function applySensitivity(delta: LookDelta, slider: number): LookDelta {
  const g = sensitivityGain(slider);
  return { dxPx: delta.dxPx * g, dyPx: delta.dyPx * g };
}

// Y-invert flag used on some platforms.
export function maybeInvertY(delta: LookDelta, invertY: boolean): LookDelta {
  return { dxPx: delta.dxPx, dyPx: invertY ? -delta.dyPx : delta.dyPx };
}

// Controller stick has a deadzone (0..1) and a curved response.
export const STICK_DEADZONE = 0.1;

export function stickCurve(stick: number): number {
  const abs = Math.abs(stick);
  if (abs < STICK_DEADZONE) return 0;
  const t = (abs - STICK_DEADZONE) / (1 - STICK_DEADZONE);
  return Math.sign(stick) * t * t;
}
