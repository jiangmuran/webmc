export const SPRINT_FOV_BONUS = 1.15;
export const SPEED_EFFECT_FOV_BONUS_PER_LEVEL = 0.05;

export function fovScale(sprinting: boolean, speedLevel: number): number {
  let scale = 1;
  if (sprinting) scale *= SPRINT_FOV_BONUS;
  scale += speedLevel * SPEED_EFFECT_FOV_BONUS_PER_LEVEL;
  return scale;
}

export function smoothedFov(current: number, target: number, alpha: number): number {
  return current + (target - current) * Math.max(0, Math.min(1, alpha));
}
