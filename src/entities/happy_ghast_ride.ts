export interface HappyGhastCtx {
  riderCount: number;
  harnessEquipped: boolean;
}

export const MAX_RIDERS = 4;

export function canCarryMore(c: HappyGhastCtx): boolean {
  return c.harnessEquipped && c.riderCount < MAX_RIDERS;
}

export function canFlyOnlyWithHarness(c: HappyGhastCtx): boolean {
  return c.harnessEquipped;
}
