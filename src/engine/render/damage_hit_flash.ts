export const HIT_FLASH_TICKS = 10;

export interface HitFlashState {
  ticksSinceHit: number;
}

export function flashIntensity(s: HitFlashState): number {
  if (s.ticksSinceHit < 0) return 0;
  if (s.ticksSinceHit >= HIT_FLASH_TICKS) return 0;
  return 1 - s.ticksSinceHit / HIT_FLASH_TICKS;
}

export function redTintColor(s: HitFlashState): [number, number, number, number] {
  return [1, 0, 0, flashIntensity(s) * 0.5];
}

export function shouldShake(s: HitFlashState): boolean {
  return s.ticksSinceHit >= 0 && s.ticksSinceHit < HIT_FLASH_TICKS;
}
