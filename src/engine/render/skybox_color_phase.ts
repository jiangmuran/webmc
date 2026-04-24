export function skyColorForTick(timeOfDay: number): { r: number; g: number; b: number } {
  const t = ((timeOfDay % 24000) + 24000) % 24000;
  const phase = t / 24000;
  const brightness = Math.sin(phase * 2 * Math.PI);
  const base = Math.max(0, brightness);
  const sunsetBoost = Math.exp(-Math.pow((phase - 0.5) * 8, 2));
  return {
    r: 0.1 + base * 0.5 + sunsetBoost * 0.5,
    g: 0.1 + base * 0.7 + sunsetBoost * 0.2,
    b: 0.3 + base * 0.6,
  };
}

export function starBrightness(timeOfDay: number): number {
  const t = ((timeOfDay % 24000) + 24000) % 24000;
  if (t >= 13000 && t <= 22300) {
    const mid = 17650;
    const factor = 1 - Math.min(1, Math.abs(t - mid) / 4000);
    return factor;
  }
  return 0;
}
