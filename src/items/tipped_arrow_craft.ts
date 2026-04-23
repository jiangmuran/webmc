// Tipped arrow: craft 8 tipped arrows around 1 lingering potion.
// Effect duration = 1/8 of lingering source.

export function craftYield(arrows: number, hasLingering: boolean): number {
  if (!hasLingering) return 0;
  if (arrows < 8) return 0;
  return 8;
}

export function effectDurationFromLingering(lingeringDurationTicks: number): number {
  return Math.floor(lingeringDurationTicks / 8);
}

export function amplifierInherited(lingeringAmplifier: number): number {
  return lingeringAmplifier;
}
