// TNT prime. Lit by flint-and-steel, fire charge, fire, redstone,
// explosion, or burning arrow. Fuse = 80 ticks (4s). In water, TNT
// still primes but explosion is suppressed (displaces only).

export type PrimeSource =
  | 'flint_and_steel'
  | 'fire_charge'
  | 'fire'
  | 'redstone'
  | 'explosion'
  | 'burning_arrow';

export interface TntEntity {
  fuseTicks: number;
  inWater: boolean;
}

export const FUSE_TICKS = 80;

// Wiki (minecraft.wiki/w/TNT): "If TNT is ignited by another
// explosion, the fuse is randomized between 10 and 30 ticks
// (0.5–1.5 seconds)." Old code computed
// `10 + ((source.length * 7) % 21)` — deterministic and equal to
// 10 for every input (since 'explosion'.length * 7 % 21 = 0). All
// chain-primed TNT got the minimum fuse, making chain reactions
// significantly faster than canon. Now uses an injected RNG to
// span 10..30 inclusive.
export function primeTnt(
  source: PrimeSource,
  inWater: boolean,
  rng: () => number = Math.random,
): TntEntity {
  let fuse = FUSE_TICKS;
  if (source === 'explosion') {
    fuse = 10 + Math.floor(rng() * 21);
  }
  return { fuseTicks: fuse, inWater };
}

export interface TickTntResult {
  exploded: boolean;
  suppressed: boolean;
}

export function tickTnt(t: TntEntity): TickTntResult {
  t.fuseTicks -= 1;
  if (t.fuseTicks > 0) return { exploded: false, suppressed: false };
  return { exploded: true, suppressed: t.inWater };
}

export const TNT_POWER = 4; // blast radius power
