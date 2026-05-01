// Daylight sensor. Signal strength tracks sky light smoothed across
// the day; inverted variant peaks at night.

// Wiki (minecraft.wiki/w/Daylight_Detector): "An inverted daylight
// detector outputs a signal of strength 15 - (regular strength)."
// Old `floor((1-b) * 15)` is NOT equivalent to `15 - floor(b * 15)`
// for fractional b — at b=0.5 the old form yields 7, the wiki form
// 15 - 7 = 8. Sibling daylight_sensor.ts already uses the wiki form.
// Switched to round(b*15) for parity (avoids the floor/ceil split
// at 0.5) and computes inverted as `15 - regular`.
export function signalFromSkyBrightness(skyBrightness: number, inverted: boolean): number {
  const b = Math.max(0, Math.min(1, skyBrightness));
  const regular = Math.max(0, Math.min(15, Math.round(b * 15)));
  return inverted ? 15 - regular : regular;
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
