// Deep dark ambient effects. Darkness status effect pulses while in
// the biome; sculk shrieker warnings add stacks that promote to
// summon a warden after 4.

export interface DarkStacks {
  level: number; // 0..4
}

export const MAX_STACKS = 4;
export const STACK_DURATION_TICKS = 3600; // 3 min

export interface Shrieker {
  stacks: DarkStacks;
  lastShriekTick: number;
}

export function shriek(s: Shrieker, nowTick: number): 'warn' | 'summon' {
  s.stacks.level = Math.min(MAX_STACKS, s.stacks.level + 1);
  s.lastShriekTick = nowTick;
  return s.stacks.level >= MAX_STACKS ? 'summon' : 'warn';
}

export function decay(s: Shrieker, nowTick: number): void {
  if (s.stacks.level <= 0) return;
  if (nowTick - s.lastShriekTick >= STACK_DURATION_TICKS) {
    s.stacks.level = Math.max(0, s.stacks.level - 1);
    s.lastShriekTick = nowTick;
  }
}

// Darkness pulse: every 2.5s (50 ticks) a 1s-long opaque fade.
export const DARKNESS_PULSE_PERIOD_TICKS = 50;

export function darknessIntensity(tickInBiome: number): number {
  const phase = tickInBiome % DARKNESS_PULSE_PERIOD_TICKS;
  if (phase < 10) return phase / 10; // fade in
  if (phase < 30) return 1;
  if (phase < 40) return 1 - (phase - 30) / 10; // fade out
  return 0;
}
