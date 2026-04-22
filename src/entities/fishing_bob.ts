// Fishing rod bob state. Cast enters CAST, bobbing in water. Random
// "bite" chance per tick (adjusted by Lure enchant). Reel during
// biting yields a catch; reel otherwise yields nothing.

export type BobPhase = 'idle' | 'cast' | 'biting' | 'reeled';

export interface FishBob {
  phase: BobPhase;
  inWater: boolean;
  biteEndMs: number;
}

export const BITE_WINDOW_MS = 750;
export const BASE_BITE_CHANCE_PER_TICK = 0.003;

export function makeBob(): FishBob {
  return { phase: 'idle', inWater: false, biteEndMs: 0 };
}

export function cast(b: FishBob, inWater: boolean): void {
  b.phase = 'cast';
  b.inWater = inWater;
  b.biteEndMs = 0;
}

export interface TickQuery {
  nowMs: number;
  lureLevel: number;
  rand: () => number;
}

export function tickBob(b: FishBob, q: TickQuery): void {
  if (b.phase === 'cast' && b.inWater) {
    const chance = BASE_BITE_CHANCE_PER_TICK * (1 + q.lureLevel * 0.2);
    if (q.rand() < chance) {
      b.phase = 'biting';
      b.biteEndMs = q.nowMs + BITE_WINDOW_MS;
    }
  } else if (b.phase === 'biting' && q.nowMs >= b.biteEndMs) {
    b.phase = 'cast';
  }
}

export function reel(b: FishBob): 'caught' | 'empty' {
  const hit = b.phase === 'biting';
  b.phase = 'reeled';
  return hit ? 'caught' : 'empty';
}
