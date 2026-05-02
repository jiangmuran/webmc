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

// Wiki (minecraft.wiki/w/Cake#Usage): "Unlike most foods, cake can
// be eaten with a full hunger bar." Old `if (eaterHunger >= 20)`
// rejected the bite at max hunger — exactly the case the wiki
// explicitly carves out, and the only case where the cake's
// "satisfy hunger without filling slots" feature actually matters.
// `eaterHunger` is now ignored; kept in the signature for back-compat
// but flagged unused so callers know it has no effect.
export function eat(c: Cake, _eaterHunger: number): EatResult {
  if (c.bitesRemaining <= 0) return { ate: false, hunger: 0, saturation: 0, remove: true };
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
