// Honey bottle. Consuming: 6 hunger, 1.2 saturation, clears poison
// effect (but not others). 2-second drink time. Crafted from 4 honey
// bottles → 1 honey block.

export interface HoneyConsumer {
  hunger: number;
  effects: Map<string, unknown>;
  eat(h: number, s: number): void;
}

export function drinkHoneyBottle(c: HoneyConsumer): boolean {
  if (c.hunger >= 20) return false;
  c.eat(6, 1.2);
  c.effects.delete('poison');
  return true;
}

// 4 honey bottles → 1 honey block recipe.
export const HONEY_BOTTLES_PER_BLOCK = 4;
