// Copper oxidation progression. 4 stages: un-oxidized → exposed →
// weathered → oxidized. Waxed copper stops progression at any stage.

export type CopperStage = 'unoxidized' | 'exposed' | 'weathered' | 'oxidized';

export const STAGES: CopperStage[] = ['unoxidized', 'exposed', 'weathered', 'oxidized'];

export function nextStage(s: CopperStage): CopperStage | null {
  const i = STAGES.indexOf(s);
  if (i === -1 || i === STAGES.length - 1) return null;
  return STAGES[i + 1] ?? null;
}

export function prevStage(s: CopperStage): CopperStage | null {
  const i = STAGES.indexOf(s);
  if (i <= 0) return null;
  return STAGES[i - 1] ?? null;
}

export interface CopperBlock {
  stage: CopperStage;
  waxed: boolean;
}

// Random tick progression: chance drops with neighbors at higher stages
// "infecting" slower (1/7500 per random tick roughly).
export const TICK_CHANCE = 1 / 7500;

export interface TickQuery {
  rand: () => number;
  adjacentHigherStage: boolean;
}

export function tryProgress(b: CopperBlock, q: TickQuery): boolean {
  if (b.waxed) return false;
  if (b.stage === 'oxidized') return false;
  const scale = q.adjacentHigherStage ? 4 : 1;
  if (q.rand() < TICK_CHANCE * scale) {
    const n = nextStage(b.stage);
    if (n) b.stage = n;
    return true;
  }
  return false;
}

// Axe scrapes one stage; honeycomb waxes; water+lightning damages wax.
export function scrapeAxe(b: CopperBlock): boolean {
  if (b.waxed) {
    b.waxed = false;
    return true;
  }
  const p = prevStage(b.stage);
  if (!p) return false;
  b.stage = p;
  return true;
}

export function wax(b: CopperBlock): boolean {
  if (b.waxed) return false;
  b.waxed = true;
  return true;
}
