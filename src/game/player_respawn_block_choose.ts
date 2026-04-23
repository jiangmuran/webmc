export interface RespawnChoiceCtx {
  bedValid: boolean;
  anchorValid: boolean;
  bedDimension: string;
  anchorDimension: string;
}

export function preferredSource(c: RespawnChoiceCtx): 'bed' | 'anchor' | 'world_spawn' {
  if (c.anchorValid) return 'anchor';
  if (c.bedValid) return 'bed';
  return 'world_spawn';
}

export function dimensionForRespawn(c: RespawnChoiceCtx): string {
  const pref = preferredSource(c);
  if (pref === 'anchor') return c.anchorDimension;
  if (pref === 'bed') return c.bedDimension;
  return 'overworld';
}
