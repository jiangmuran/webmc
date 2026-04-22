// Strider. Nether mob that walks on lava. Shivers on land (loses
// speed). Saddle + warped fungus on stick lets player ride it.

export interface Strider {
  inLava: boolean;
  saddled: boolean;
  pupAgeTicks: number;
  coldTicks: number; // ticks outside lava
}

export const COLD_THRESHOLD = 10;

export function tickStrider(s: Strider): void {
  if (s.inLava) {
    s.coldTicks = 0;
  } else {
    s.coldTicks = Math.min(600, s.coldTicks + 1);
  }
  if (s.pupAgeTicks > 0) s.pupAgeTicks -= 1;
}

export function isShivering(s: Strider): boolean {
  return s.coldTicks >= COLD_THRESHOLD;
}

export function moveSpeed(s: Strider): number {
  if (s.inLava) return 0.23;
  return isShivering(s) ? 0.04 : 0.12;
}

// Riding speed boost with warped fungus on stick.
export function ridingSpeed(s: Strider, hasWarpedFungusOnStick: boolean): number {
  const base = moveSpeed(s);
  return hasWarpedFungusOnStick ? base * 1.35 : base;
}

// Can't be bred, but adults can be leashed-led.
export function canBeLeashed(s: Strider): boolean {
  return s.pupAgeTicks <= 0;
}
