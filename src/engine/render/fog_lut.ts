// Fog LUT. Time-of-day and weather drive fog color + density. Sampled by
// the renderer each frame to produce a smooth day/dusk/night gradient.

export interface FogEntry {
  timeOfDay: number; // 0..24000
  color: readonly [number, number, number];
  density: number; // 0..1
}

export const FOG_DAYLIGHT_LUT: readonly FogEntry[] = [
  { timeOfDay: 0, color: [40, 40, 90], density: 0.8 },
  { timeOfDay: 2000, color: [120, 100, 120], density: 0.6 },
  { timeOfDay: 6000, color: [198, 221, 255], density: 0.2 },
  { timeOfDay: 10000, color: [198, 221, 255], density: 0.2 },
  { timeOfDay: 12000, color: [230, 140, 100], density: 0.5 },
  { timeOfDay: 14000, color: [40, 40, 90], density: 0.8 },
  { timeOfDay: 24000, color: [40, 40, 90], density: 0.8 },
];

function lerp3(
  a: readonly [number, number, number],
  b: readonly [number, number, number],
  t: number,
): readonly [number, number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

export function sampleFog(timeOfDay: number): {
  color: readonly [number, number, number];
  density: number;
} {
  const normalized = ((timeOfDay % 24000) + 24000) % 24000;
  const entries = FOG_DAYLIGHT_LUT;
  for (let i = 0; i < entries.length - 1; i++) {
    const a = entries[i];
    const b = entries[i + 1];
    if (!a || !b) continue;
    if (normalized >= a.timeOfDay && normalized <= b.timeOfDay) {
      const span = b.timeOfDay - a.timeOfDay || 1;
      const t = (normalized - a.timeOfDay) / span;
      return {
        color: lerp3(a.color, b.color, t),
        density: a.density + (b.density - a.density) * t,
      };
    }
  }
  const last = entries[entries.length - 1];
  return last ? { color: last.color, density: last.density } : { color: [0, 0, 0], density: 0 };
}

export function applyWeatherTint(
  fog: { color: readonly [number, number, number]; density: number },
  rainStrength: number,
  thunderStrength: number,
): { color: readonly [number, number, number]; density: number } {
  const dim = 1 - Math.min(1, rainStrength * 0.3 + thunderStrength * 0.5);
  return {
    color: [fog.color[0] * dim, fog.color[1] * dim, fog.color[2] * dim],
    density: Math.min(1, fog.density + rainStrength * 0.3 + thunderStrength * 0.4),
  };
}
