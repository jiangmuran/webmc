// Nether wart. 4 growth stages on soul sand. Stage 3 drops 2-4 nether
// wart + 1 extra with Fortune III. Fully grown resets to stage 0.

export interface NetherWartState {
  stage: number; // 0..3
}

const MAX_STAGE = 3;
const GROWTH_CHANCE_PER_TICK = 0.1;

export function makeNetherWart(): NetherWartState {
  return { stage: 0 };
}

export function growNetherWart(
  state: NetherWartState,
  onSoulSand: boolean,
  rng: () => number = Math.random,
): boolean {
  if (!onSoulSand) return false;
  if (state.stage >= MAX_STAGE) return false;
  if (rng() < GROWTH_CHANCE_PER_TICK) {
    state.stage++;
    return true;
  }
  return false;
}

export interface HarvestResult {
  drops: readonly string[];
  newStage: number;
}

export function harvestNetherWart(
  state: NetherWartState,
  fortuneLevel = 0,
  rng: () => number = Math.random,
): HarvestResult {
  if (state.stage < MAX_STAGE) {
    return { drops: ['webmc:nether_wart'], newStage: state.stage };
  }
  const base = 2 + Math.floor(rng() * 3); // 2..4
  const bonus = Math.floor(rng() * (fortuneLevel + 1));
  const total = base + bonus;
  return {
    drops: Array.from({ length: total }, () => 'webmc:nether_wart'),
    newStage: 0,
  };
}
