export interface OminousVaultCtx {
  withOminousKey: boolean;
  playerHasBadOmen: boolean;
  previouslyUsedByPlayer: boolean;
}

export function canUnlock(c: OminousVaultCtx): boolean {
  return c.withOminousKey && !c.previouslyUsedByPlayer;
}

export function consumesKey(): boolean {
  return true;
}

export function dropsOminousLoot(c: OminousVaultCtx): boolean {
  return canUnlock(c);
}
