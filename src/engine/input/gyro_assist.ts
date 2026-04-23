// Mobile gyro assist. Low-pass filter for device orientation used to
// add subtle look delta on top of touch look. Disabled by default.

export interface GyroSample {
  alpha: number; // yaw
  beta: number;
  gamma: number;
}

export interface GyroSmoothed {
  lastYaw: number;
  enabled: boolean;
  gain: number;
}

export const DEFAULT_GYRO_GAIN = 0.3;

export function init(): GyroSmoothed {
  return { lastYaw: 0, enabled: false, gain: DEFAULT_GYRO_GAIN };
}

export function onSample(
  s: GyroSmoothed,
  sample: GyroSample,
): { yawDelta: number; state: GyroSmoothed } {
  if (!s.enabled) return { yawDelta: 0, state: s };
  let diff = sample.alpha - s.lastYaw;
  // Normalize to [-180,180]
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;
  return { yawDelta: diff * s.gain, state: { ...s, lastYaw: sample.alpha } };
}

export function setEnabled(s: GyroSmoothed, on: boolean): GyroSmoothed {
  return { ...s, enabled: on };
}
