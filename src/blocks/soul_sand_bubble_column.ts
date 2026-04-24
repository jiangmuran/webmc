export type BubbleKind = 'upward' | 'downward' | 'none';

export function bubbleKindFor(baseBlock: string): BubbleKind {
  if (baseBlock === 'soul_sand') return 'upward';
  if (baseBlock === 'magma_block') return 'downward';
  return 'none';
}

export function bubbleAppliesVertical(kind: BubbleKind): number {
  if (kind === 'upward') return 0.7;
  if (kind === 'downward') return -0.7;
  return 0;
}

export function pullsEntitiesIn(kind: BubbleKind): boolean {
  return kind !== 'none';
}
