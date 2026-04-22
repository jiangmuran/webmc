// Daylight detector. Emits redstone signal proportional to sky
// brightness during day (or night, if inverted via right-click).

export const MAX_SIGNAL = 15;

export interface DaylightDetector {
  inverted: boolean;
}

export interface SignalQuery {
  skyLight0to15: number; // 0..15
  rainingOrThundering: boolean;
  dayFraction: number; // 0 = midnight, 0.5 = noon
}

export function daylightSignal(q: SignalQuery): number {
  // brightness curve approximation: peaks at noon, zero at night.
  const bright = Math.max(0, Math.sin(q.dayFraction * Math.PI * 2));
  let s = Math.round(bright * q.skyLight0to15);
  if (q.rainingOrThundering) s = Math.max(0, s - 5);
  return Math.max(0, Math.min(MAX_SIGNAL, s));
}

export function output(d: DaylightDetector, q: SignalQuery): number {
  const s = daylightSignal(q);
  return d.inverted ? MAX_SIGNAL - s : s;
}

export function toggleInvert(d: DaylightDetector): void {
  d.inverted = !d.inverted;
}
