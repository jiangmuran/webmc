import { describe, it, expect } from 'vitest';
import { makeTarget, onProjectileHit, tickTarget } from './target_block';

describe('target block', () => {
  it('bullseye → signal 15', () => {
    const t = makeTarget();
    expect(onProjectileHit(t, 0)).toBe(15);
  });

  it('edge hit → low signal', () => {
    const t = makeTarget();
    const s = onProjectileHit(t, 0.7);
    expect(s).toBeLessThan(5);
    expect(s).toBeGreaterThanOrEqual(1);
  });

  it('decays to 0 after 1 second', () => {
    const t = makeTarget();
    onProjectileHit(t, 0);
    tickTarget(t, 1.1);
    expect(t.signal).toBe(0);
  });

  it('holding for < 1s keeps signal', () => {
    const t = makeTarget();
    onProjectileHit(t, 0);
    tickTarget(t, 0.5);
    expect(t.signal).toBe(15);
  });
});
