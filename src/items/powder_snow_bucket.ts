// Powder snow bucket. Holds 1 block of powder snow. Picks up with
// an empty bucket from powder snow block; places it as a block.

export interface BucketState {
  kind: 'empty' | 'powder_snow';
}

export function pickUp(b: BucketState, blockId: string): BucketState | null {
  if (b.kind !== 'empty') return null;
  if (blockId !== 'powder_snow') return null;
  return { kind: 'powder_snow' };
}

export function placeBlock(b: BucketState): { bucket: BucketState; placed: 'powder_snow' | null } {
  if (b.kind !== 'powder_snow') return { bucket: b, placed: null };
  return { bucket: { kind: 'empty' }, placed: 'powder_snow' };
}

export function stackSize(): number {
  return 1;
}
