// Daylight sensor. Signal strength tracks sky light smoothed across
// the day; inverted variant peaks at night.

export function signalFromSkyBrightness(skyBrightness: number, inverted: boolean): number {
  const b = Math.max(0, Math.min(1, skyBrightness));
  const value = inverted ? 1 - b : b;
  return Math.max(0, Math.min(15, Math.floor(value * 15)));
}

// Daytime sky brightness from tick-of-day (0..24000).
// Peaks near noon (6000), zero near midnight.
export function skyBrightness(tickOfDay: number): number {
  const t = ((tickOfDay % 24000) + 24000) % 24000;
  // Daylight window: 0..12000. Trim to cos curve peaking at 6000.
  if (t >= 13000) return 0;
  if (t > 12000) return 0;
  return Math.sin((t / 12000) * Math.PI);
}

export function canToggleInverted(): boolean {
  return true;
}
