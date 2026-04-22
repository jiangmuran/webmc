// Calibrated sculk sensor: filters vibrations by frequency via a
// redstone signal applied to its side input (1..15 = target frequency).

export const MAX_FREQUENCY = 15;

export interface CalibratedSensor {
  filterFrequency: number; // 0 = no filter, 1..15 specific freq
}

export function shouldTrigger(s: CalibratedSensor, vibrationFrequency: number): boolean {
  if (s.filterFrequency === 0) return true;
  return vibrationFrequency === s.filterFrequency;
}

export function setFilterFromInput(signal: number): CalibratedSensor {
  return { filterFrequency: Math.max(0, Math.min(MAX_FREQUENCY, Math.floor(signal))) };
}

// Emitted signal strength mirrors vibration frequency (like base sensor).
export function emittedSignal(vibrationFrequency: number): number {
  return Math.max(0, Math.min(15, vibrationFrequency));
}
