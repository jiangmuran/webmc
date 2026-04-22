import { describe, it, expect } from 'vitest';
import { samplePiece, type JigsawPool } from './structure_jigsaw_pool';

describe('jigsaw pool', () => {
  const pool: JigsawPool = {
    pieces: [
      { id: 'a', weight: 1, joints: [] },
      { id: 'b', weight: 3, joints: [] },
    ],
    fallback: { id: 'end', weight: 0, joints: [] },
  };

  it('atMaxDepth returns fallback', () => {
    const p = samplePiece({ pool, rand: () => 0.5, atMaxDepth: true });
    expect(p?.id).toBe('end');
  });

  it('samples by weight', () => {
    const low = samplePiece({ pool, rand: () => 0.01, atMaxDepth: false });
    expect(low?.id).toBe('a');
    const high = samplePiece({ pool, rand: () => 0.9, atMaxDepth: false });
    expect(high?.id).toBe('b');
  });

  it('empty pool returns fallback', () => {
    const empty: JigsawPool = { pieces: [], fallback: { id: 'end', weight: 0, joints: [] } };
    expect(samplePiece({ pool: empty, rand: () => 0, atMaxDepth: false })?.id).toBe('end');
  });
});
