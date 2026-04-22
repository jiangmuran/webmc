// Milk bucket. Drinking clears ALL active effects (positive and negative)
// and returns an empty bucket.

export interface EffectBearer {
  effects: Map<string, { amplifier: number; remainingSec: number }>;
}

export interface MilkResult {
  clearedCount: number;
  returnsBucket: boolean;
}

export function drinkMilk(target: EffectBearer): MilkResult {
  const count = target.effects.size;
  target.effects.clear();
  return { clearedCount: count, returnsBucket: true };
}
