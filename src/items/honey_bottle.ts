// Honey bottle. Consuming: 6 hunger, 1.2 saturation, clears poison
// effect (but not others). 2-second drink time. Crafted from 4 honey
// bottles → 1 honey block.
//
// Wiki (minecraft.wiki/w/Honey_Bottle): "Honey bottles can be drunk
// even with a full hunger bar." Old code refused at full hunger,
// blocking the canonical use of drinking just to clear poison. The
// hunger restore portion of `eat` no-ops at full hunger anyway, so
// removing the gate doesn't over-feed.

export interface HoneyConsumer {
  hunger: number;
  effects: Map<string, unknown>;
  eat(h: number, s: number): void;
}

export function drinkHoneyBottle(c: HoneyConsumer): boolean {
  c.eat(6, 1.2);
  c.effects.delete('poison');
  return true;
}

// 4 honey bottles → 1 honey block recipe.
export const HONEY_BOTTLES_PER_BLOCK = 4;
