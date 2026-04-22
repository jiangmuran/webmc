// Respiration (helmet). Extends underwater breath timer by 15s/level.
// Also reduces chance of drowning damage per tick underwater.

export const RESPIRATION_MAX_LEVEL = 3;
export const BREATH_BASE_TICKS = 300; // 15s
export const BREATH_PER_LEVEL_TICKS = 300;

export function breathTicks(level: number): number {
  return (
    BREATH_BASE_TICKS + Math.max(0, Math.min(RESPIRATION_MAX_LEVEL, level)) * BREATH_PER_LEVEL_TICKS
  );
}

// Chance to avoid drowning damage per tick when out of air.
export function avoidDrowningChance(level: number): number {
  if (level <= 0) return 0;
  return level / (level + 1);
}

// Improves underwater visibility while worn (alpha tweak elsewhere).
export function improvesVisibility(level: number): boolean {
  return level > 0;
}
