// Gamma / brightness. The setting is a float (0..1). Internal "moody"
// level is at 0, "bright" at 1. Gamma curve used on light levels
// before render.

export const GAMMA_MIN = 0;
export const GAMMA_MAX = 1;

export function clampGamma(g: number): number {
  if (!Number.isFinite(g)) return 0.5;
  return Math.max(GAMMA_MIN, Math.min(GAMMA_MAX, g));
}

// MC curve: skyLight contribution = 0.05 + (1-0.05) * ((lvl/15) * (gamma*0.95+0.05))
// Simplified to a monotone 0..1 output.
export function displayLight(light: number, gamma: number): number {
  const lvl = Math.max(0, Math.min(15, light));
  const base = lvl / 15;
  const g = clampGamma(gamma);
  return 0.05 + (1 - 0.05) * base * (g * 0.95 + 0.05);
}

// "Night vision" effect override: boosts regardless of gamma.
export function displayLightWithNightVision(light: number, gamma: number): number {
  return Math.max(displayLight(light, gamma), 0.95);
}
