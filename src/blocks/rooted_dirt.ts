// Rooted dirt. Drops hanging roots when mined; bonemeal on face of
// rooted dirt yields hanging roots beneath.

export function drops(toolKind: string): string[] {
  if (toolKind === 'shovel') return ['rooted_dirt'];
  return ['rooted_dirt'];
}

export interface BonemealCtx {
  faceClickedDown: boolean;
  blockBelowIsAir: boolean;
}

export type BonemealOutcome = { kind: 'place_hanging_roots' } | { kind: 'none' };

export function onBonemeal(c: BonemealCtx): BonemealOutcome {
  if (c.faceClickedDown && c.blockBelowIsAir) return { kind: 'place_hanging_roots' };
  return { kind: 'none' };
}

export function hoeConverts(): string {
  return 'dirt';
}
