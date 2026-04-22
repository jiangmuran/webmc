// Mouse sensitivity curve. Raw mouse-delta pixels are converted to yaw
// + pitch radians with a configurable sensitivity (0..2 → 0.1°..2°/px)
// and an optional power-curve exponent for accel-like feel.

export interface SensitivityConfig {
  sensitivity: number; // 0..2
  invertY: boolean;
  curveExponent: number; // 1 = linear; >1 = progressive (accel)
}

export function defaultSensitivityConfig(): SensitivityConfig {
  return { sensitivity: 0.5, invertY: false, curveExponent: 1 };
}

export interface MouseDelta {
  dxPx: number;
  dyPx: number;
}

export interface Look {
  yawDelta: number;
  pitchDelta: number;
}

// MC formula (simplified): 0.6 * sens + 0.2 over linear range,
// raised to the curveExponent cube-rooted bit. We approximate:
//   radiansPerPx = 0.0008 × (0.6 × sens + 0.2)³
const BASE_RADIANS_PER_PX = 0.0008;

export function mouseToLook(delta: MouseDelta, cfg: SensitivityConfig): Look {
  const sensFactor = (0.6 * cfg.sensitivity + 0.2) ** 3;
  const dx = applyCurve(delta.dxPx, cfg.curveExponent);
  const dy = applyCurve(delta.dyPx, cfg.curveExponent);
  return {
    yawDelta: dx * sensFactor * BASE_RADIANS_PER_PX,
    pitchDelta: (cfg.invertY ? -dy : dy) * sensFactor * BASE_RADIANS_PER_PX,
  };
}

function applyCurve(raw: number, exp: number): number {
  if (exp === 1) return raw;
  const sign = Math.sign(raw);
  const mag = Math.abs(raw);
  return sign * mag ** exp;
}

// Clamp pitch to [-π/2, π/2] (can't look past straight up/down).
export const MAX_PITCH = Math.PI / 2 - 0.01;

export function clampPitch(pitch: number): number {
  return Math.max(-MAX_PITCH, Math.min(MAX_PITCH, pitch));
}

// Hide-behind-UI acceleration: when a UI window is open, raw mouse
// deltas steer the cursor, not the camera.
export function suppressDuringUI(delta: MouseDelta, uiOpen: boolean): MouseDelta {
  return uiOpen ? { dxPx: 0, dyPx: 0 } : delta;
}
