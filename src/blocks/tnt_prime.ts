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

export function primeTnt(source: PrimeSource, inWater: boolean): TntEntity {
  let fuse = FUSE_TICKS;
  if (source === 'explosion') {
    // Chained TNT has randomized shorter fuse (deterministic 10..30)
    fuse = 10 + ((source.length * 7) % 21);
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
