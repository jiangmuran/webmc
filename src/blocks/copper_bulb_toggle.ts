export type CopperStage = 'new' | 'exposed' | 'weathered' | 'oxidized';

export interface BulbState {
  lit: boolean;
  stage: CopperStage;
  powered: boolean;
}

export const LIGHT_BY_STAGE: Record<CopperStage, number> = {
  new: 15,
  exposed: 12,
  weathered: 8,
  oxidized: 4,
};

export function onRedstoneEdge(b: BulbState, risingEdge: boolean): BulbState {
  if (!risingEdge) return b;
  return { ...b, lit: !b.lit };
}

export function lightLevel(b: BulbState): number {
  return b.lit ? LIGHT_BY_STAGE[b.stage] : 0;
}
