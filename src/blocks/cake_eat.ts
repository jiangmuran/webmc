// Cake. 7 bites; each bite gives 2 hunger + 0.4 saturation. Last bite
// removes the block. Placed on any full top face. Consumed in world,
// not by inventory.

export interface Cake {
  bitesRemaining: number; // 7 fresh, 0 = should be removed
}

export const FRESH_BITES = 7;
export const BITE_HUNGER = 2;
export const BITE_SATURATION = 0.4;

export function makeCake(): Cake {
  return { bitesRemaining: FRESH_BITES };
}

export interface EatResult {
  ate: boolean;
  hunger: number;
  saturation: number;
  remove: boolean;
}

export function eat(c: Cake, eaterHunger: number): EatResult {
  if (c.bitesRemaining <= 0) return { ate: false, hunger: 0, saturation: 0, remove: true };
  if (eaterHunger >= 20) return { ate: false, hunger: 0, saturation: 0, remove: false };
  c.bitesRemaining -= 1;
  return {
    ate: true,
    hunger: BITE_HUNGER,
    saturation: BITE_SATURATION,
    remove: c.bitesRemaining <= 0,
  };
}

// Cake with candle: lit candle on top — right-click extinguishes then
// eat as normal.
export function extinguishCandleOnCake(lit: boolean): boolean {
  return lit;
}
