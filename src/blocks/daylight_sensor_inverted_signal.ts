export interface SensorInput {
  inverted: boolean;
  skyLight: number;
  weatherDimming: number;
}

export const MAX_SIGNAL = 15;

export function signalOutput(i: SensorInput): number {
  const effective = Math.max(0, Math.min(15, i.skyLight - i.weatherDimming));
  const raw = Math.floor((effective / 15) * MAX_SIGNAL);
  return i.inverted ? MAX_SIGNAL - raw : raw;
}

export function togglesOnUse(current: boolean): boolean {
  return !current;
}
