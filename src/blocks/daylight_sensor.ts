// Daylight sensor. Outputs a redstone signal proportional to the sun
// angle. Inverted mode (toggled by right-click) reverses the output so
// night lamps can be powered.

export interface DaylightSensorState {
  inverted: boolean;
}

export function makeDaylightSensor(): DaylightSensorState {
  return { inverted: false };
}

export function toggleInverted(state: DaylightSensorState): void {
  state.inverted = !state.inverted;
}

// MC: signal = round(skyLight × brightness(timeOfDay)). We simplify to a
// sinusoidal curve based on timeOfDay in [0, 24000).
export function signalStrength(state: DaylightSensorState, timeOfDay: number): number {
  const normalized = ((timeOfDay % 24000) + 24000) % 24000;
  // Peak at time 6000 (noon), zero at time 0 and 18000 (midnight).
  const daylight = normalized < 12000 ? Math.sin((normalized / 12000) * Math.PI) : 0;
  const base = Math.round(daylight * 15);
  return state.inverted ? 15 - base : base;
}
