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

// Wiki (minecraft.wiki/w/Oxidation): "If at least one ... copper block
// within a 4-block taxicab distance is at a higher oxidation stage,
// the block has approximately a 5.69% (= 64/1125) probability per
// random tick to advance to the next stage. If no such block exists,
// the chance is multiplied by 0.75 (~4.27%)."
//
// Old `TICK_CHANCE = 1/7500 ≈ 0.000133` was ~100× under wiki canon.
// The × 4 multiplier for adjacent-higher (≈ 0.000533 effective) was
// still 100× too low. Sibling copper_waxing.ts already uses 0.043
// per random tick — this module now matches and adds the wiki's
// distinct "isolated" vs "near higher" rates.
export const TICK_CHANCE_ISOLATED = (64 / 1125) * 0.75; // ≈ 0.0427
export const TICK_CHANCE_NEAR_HIGHER = 64 / 1125; // ≈ 0.0569

export interface TickQuery {
  rand: () => number;
  adjacentHigherStage: boolean;
}

export function tryProgress(b: CopperBlock, q: TickQuery): boolean {
  if (b.waxed) return false;
  if (b.stage === 'oxidized') return false;
  const chance = q.adjacentHigherStage ? TICK_CHANCE_NEAR_HIGHER : TICK_CHANCE_ISOLATED;
  if (q.rand() < chance) {
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
