// Saturation depletion. Saturation buffers hunger; depletes before
// hunger. Eating refills both.

export interface HungerTick {
  food: number; // 0..20
  saturation: number; // ≤ food
  exhaustion: number; // 0..4
}

export const EXHAUSTION_PER_DROP = 4;

export function tick(s: HungerTick): HungerTick {
  if (s.exhaustion < EXHAUSTION_PER_DROP) return s;
  const rem = s.exhaustion - EXHAUSTION_PER_DROP;
  if (s.saturation > 0) {
    return { ...s, saturation: Math.max(0, s.saturation - 1), exhaustion: rem };
  }
  return { ...s, food: Math.max(0, s.food - 1), exhaustion: rem };
}

export function eat(s: HungerTick, foodPoints: number, saturationAmount: number): HungerTick {
  const food = Math.min(20, s.food + foodPoints);
  const saturation = Math.min(food, s.saturation + saturationAmount);
  return { ...s, food, saturation };
}

export function regenAllowed(s: HungerTick): boolean {
  return s.food >= 18;
}

export function regenTick(s: HungerTick): HungerTick {
  if (!regenAllowed(s)) return s;
  return { ...s, exhaustion: s.exhaustion + 6 };
}
