// Eating animation timer. Holding right-click for the full eat time
// consumes the food; releasing early cancels.

export interface EatingState {
  foodId: string;
  ticksHeld: number;
  requiredTicks: number;
  cancelled: boolean;
}

export function start(foodId: string, requiredTicks = 32): EatingState {
  return { foodId, ticksHeld: 0, requiredTicks, cancelled: false };
}

export function tick(s: EatingState): EatingState {
  if (s.cancelled) return s;
  return { ...s, ticksHeld: Math.min(s.requiredTicks, s.ticksHeld + 1) };
}

export function release(s: EatingState): { consumed: boolean; foodId: string } {
  if (s.ticksHeld >= s.requiredTicks) return { consumed: true, foodId: s.foodId };
  return { consumed: false, foodId: s.foodId };
}

export function cancel(s: EatingState): EatingState {
  return { ...s, cancelled: true };
}

export function progress01(s: EatingState): number {
  return s.ticksHeld / s.requiredTicks;
}
