import { describe, it, expect } from 'vitest';
import { makeShrieker, shriek } from './sculk_shrieker';

describe('sculk shrieker', () => {
  it('first shriek is warning level 1', () => {
    const s = makeShrieker();
    const r = shriek(s, 'alice', 0);
    expect(r.warningLevel).toBe(1);
    expect(r.summonWarden).toBe(false);
  });

  it('4th shriek summons the warden', () => {
    const s = makeShrieker();
    shriek(s, 'alice', 0);
    shriek(s, 'alice', 1);
    shriek(s, 'alice', 2);
    const r = shriek(s, 'alice', 3);
    expect(r.summonWarden).toBe(true);
  });

  it('timer reset drops warning back to 1', () => {
    const s = makeShrieker();
    shriek(s, 'alice', 0);
    shriek(s, 'alice', 1);
    const r = shriek(s, 'alice', 1000);
    expect(r.warningLevel).toBe(1);
  });

  it('per-player counters are independent', () => {
    const s = makeShrieker();
    shriek(s, 'alice', 0);
    shriek(s, 'alice', 1);
    const r = shriek(s, 'bob', 2);
    expect(r.warningLevel).toBe(1);
  });
});
