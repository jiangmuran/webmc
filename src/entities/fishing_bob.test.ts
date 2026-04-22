import { describe, it, expect } from 'vitest';
import { makeBob, cast, tickBob, reel } from './fishing_bob';

describe('fishing bob', () => {
  it('reel before bite = empty', () => {
    const b = makeBob();
    cast(b, true);
    expect(reel(b)).toBe('empty');
  });

  it('bite then reel = caught', () => {
    const b = makeBob();
    cast(b, true);
    tickBob(b, { nowMs: 100, lureLevel: 0, rand: () => 0 });
    expect(b.phase).toBe('biting');
    expect(reel(b)).toBe('caught');
  });

  it('never bites out of water', () => {
    const b = makeBob();
    cast(b, false);
    for (let i = 0; i < 100; i++) {
      tickBob(b, { nowMs: i, lureLevel: 0, rand: () => 0 });
    }
    expect(b.phase).toBe('cast');
  });

  it('biting expires after window', () => {
    const b = makeBob();
    cast(b, true);
    tickBob(b, { nowMs: 0, lureLevel: 0, rand: () => 0 });
    expect(b.phase).toBe('biting');
    tickBob(b, { nowMs: 1000, lureLevel: 0, rand: () => 1 });
    expect(b.phase).toBe('cast');
  });
});
