// Redstone extends potion duration; glowstone amplifies level.
// Mutually exclusive per potion.

export interface PotionTag {
  amplifier: number;
  durationTicks: number;
  amplified: boolean;
  extended: boolean;
}

export const BASE_DURATION_TICKS = 3600; // 3 min
export const EXTENDED_DURATION_TICKS = 9600; // 8 min
export const AMPLIFIED_DURATION_TICKS = 1800; // 1.5 min

export function applyRedstone(p: PotionTag): PotionTag | null {
  if (p.amplified) return null;
  return { ...p, extended: true, durationTicks: EXTENDED_DURATION_TICKS };
}

export function applyGlowstone(p: PotionTag): PotionTag | null {
  if (p.extended) return null;
  return {
    ...p,
    amplified: true,
    amplifier: p.amplifier + 1,
    durationTicks: AMPLIFIED_DURATION_TICKS,
  };
}

export function basePotion(): PotionTag {
  return { amplifier: 0, durationTicks: BASE_DURATION_TICKS, amplified: false, extended: false };
}
