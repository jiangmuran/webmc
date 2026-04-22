// Daylight sensor output signal. Normal mode: signal = floor(skyLight /
// 15 × 15). Inverted mode: signal = 15 - normal. Right-clicking the
// sensor toggles modes.

export interface DaylightSensorState {
  inverted: boolean;
}

export function makeDaylightSensor(inverted = false): DaylightSensorState {
  return { inverted };
}

export function toggleInverted(state: DaylightSensorState): void {
  state.inverted = !state.inverted;
}

// skyLight: 0..15 (actual sky-light level at the sensor's y+1 block).
// Rainy weather reduces the effective sky light to ~12.
export interface DaylightQuery {
  skyLight: number; // 0..15
  weather: 'clear' | 'rain' | 'thunder';
}

export function sensorOutput(state: DaylightSensorState, q: DaylightQuery): number {
  let sl = q.skyLight;
  if (q.weather === 'rain') sl = Math.min(sl, 12);
  if (q.weather === 'thunder') sl = Math.min(sl, 10);
  const normal = Math.max(0, Math.min(15, Math.round(sl)));
  return state.inverted ? 15 - normal : normal;
}

// Time of day fractional light for a "sky simulation": input is
// normalizedTime [0, 1); returns 0..15 smooth. Used by caller to feed
// into sensorOutput.
export function skyLightAtTime(normalizedTime: number): number {
  // 0 = dawn, 0.25 = noon, 0.5 = dusk, 0.75 = midnight.
  const t = ((normalizedTime % 1) + 1) % 1;
  // Day window around noon (0.25); night window around midnight (0.75).
  if (t >= 0.02 && t <= 0.48) return 15;
  if (t >= 0.52 && t <= 0.98) return 0;
  if (t > 0.48 && t < 0.52) return Math.round(((0.52 - t) / 0.04) * 15);
  if (t > 0.98) return Math.round((1 - (t - 0.98) / 0.04) * 15);
  return Math.round((t / 0.02) * 15);
}
