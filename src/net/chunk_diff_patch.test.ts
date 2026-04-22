import { describe, it, expect } from 'vitest';
import { applyPatch, patchSize, patchFullyRebuild } from './chunk_diff_patch';

describe('chunk diff patch', () => {
  it('applies when hash matches', () => {
    const blocks = [0, 0, 0];
    expect(
      applyPatch(
        blocks,
        { subChunkIdx: 0, priorHash: 'h1', edits: [{ index: 1, paletteId: 5 }] },
        'h1',
      ),
    ).toBe(true);
    expect(blocks[1]).toBe(5);
  });

  it('rejects stale hash', () => {
    const blocks = [0, 0];
    expect(
      applyPatch(
        blocks,
        { subChunkIdx: 0, priorHash: 'h1', edits: [{ index: 0, paletteId: 7 }] },
        'h2',
      ),
    ).toBe(false);
    expect(blocks[0]).toBe(0);
  });

  it('size grows with edits', () => {
    expect(patchSize({ subChunkIdx: 0, priorHash: '', edits: [] })).toBeLessThan(
      patchSize({ subChunkIdx: 0, priorHash: '', edits: [{ index: 0, paletteId: 0 }] }),
    );
  });

  it('full rebuild covers all', () => {
    const p = patchFullyRebuild([1, 2, 3]);
    expect(p.edits.length).toBe(3);
  });
});
