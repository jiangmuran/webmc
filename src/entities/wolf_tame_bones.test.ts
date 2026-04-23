import { describe, it, expect } from 'vitest';
import { onFeedBone, TAME_THRESHOLD } from './wolf_tame_bones';

describe('wolf tame bones', () => {
  it('tames after threshold', () => {
    let w = { tameProgress: 0, isTamed: false };
    for (let i = 0; i < TAME_THRESHOLD; i++) w = onFeedBone(w, () => 0);
    expect(w.isTamed).toBe(true);
  });

  it('unlucky no progress', () => {
    const w = onFeedBone({ tameProgress: 0, isTamed: false }, () => 0.99);
    expect(w.tameProgress).toBe(0);
  });

  it('already tamed unchanged', () => {
    const w = onFeedBone({ tameProgress: 5, isTamed: true }, () => 0);
    expect(w.tameProgress).toBe(5);
  });
});
