export interface OmenCtx {
  level: number;
  inVillage: boolean;
  raidActive: boolean;
}

export const MAX_LEVEL = 5;

export function triggersRaid(c: OmenCtx): boolean {
  return c.inVillage && c.level > 0 && !c.raidActive;
}

export function raidDifficultyBump(c: OmenCtx): number {
  return Math.max(0, Math.min(MAX_LEVEL, c.level) - 1);
}

export function clearsOnEnterVillage(c: OmenCtx): boolean {
  return c.inVillage && c.level > 0;
}
