// Sniffer + ancient seeds. Sniffer mobs periodically dig up "ancient
// seeds" (torchflower / pitcher pod), which can be planted + grown.

export type AncientSeed = 'torchflower_seeds' | 'pitcher_pod';

const SEED_WEIGHTS: Record<AncientSeed, number> = {
  torchflower_seeds: 60,
  pitcher_pod: 40,
};

export function rollAncientSeed(rng: () => number = Math.random): AncientSeed {
  const total = SEED_WEIGHTS.torchflower_seeds + SEED_WEIGHTS.pitcher_pod;
  let pick = rng() * total;
  for (const seed of Object.keys(SEED_WEIGHTS) as AncientSeed[]) {
    pick -= SEED_WEIGHTS[seed];
    if (pick <= 0) return seed;
  }
  return 'torchflower_seeds';
}

// Sniffer behaviour: sniffs for ~10s, digs for ~6s, then produces a seed
// on suitable ground (grass / dirt / podzol / coarse_dirt).
export interface SnifferState {
  phase: 'idle' | 'sniffing' | 'digging' | 'cooldown';
  phaseSec: number;
}

export function makeSnifferState(): SnifferState {
  return { phase: 'idle', phaseSec: 0 };
}

export interface SnifferTickContext {
  diggableBelow: boolean;
  rng: () => number;
}

const PHASE_TIMES: Record<SnifferState['phase'], number> = {
  idle: 10,
  sniffing: 10,
  digging: 6,
  cooldown: 30,
};

export interface SnifferStepResult {
  producedSeed: AncientSeed | null;
}

export function tickSniffer(
  state: SnifferState,
  dtSec: number,
  ctx: SnifferTickContext,
): SnifferStepResult {
  state.phaseSec += dtSec;
  const limit = PHASE_TIMES[state.phase];
  if (state.phaseSec < limit) return { producedSeed: null };
  state.phaseSec = 0;
  switch (state.phase) {
    case 'idle':
      state.phase = 'sniffing';
      return { producedSeed: null };
    case 'sniffing':
      state.phase = ctx.diggableBelow ? 'digging' : 'cooldown';
      return { producedSeed: null };
    case 'digging': {
      state.phase = 'cooldown';
      return { producedSeed: rollAncientSeed(ctx.rng) };
    }
    case 'cooldown':
      state.phase = 'idle';
      return { producedSeed: null };
  }
}

// Torchflower + pitcher plant grow in two or three stages.
export interface AncientPlantGrowth {
  stage: number;
  maxStage: number;
}

export function plantGrowthTick(
  state: AncientPlantGrowth,
  rng: () => number,
  baseChance: number,
): void {
  if (state.stage >= state.maxStage) return;
  if (rng() < baseChance) state.stage++;
}
