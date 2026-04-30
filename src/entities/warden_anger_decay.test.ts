import { describe, it, expect } from 'vitest';
import {
  addAnger,
  tickDecay,
  primaryTarget,
  attackMode,
  MAX_ANGER,
  DIG_THRESHOLD,
  RANGED_THRESHOLD,
} from './warden_anger_decay';

describe('warden anger decay', () => {
  it('first event creates record', () => {
    const a = addAnger([], 'alice', 50);
    expect(a[0]?.level).toBe(50);
  });

  it('subsequent adds', () => {
    const a = addAnger([{ targetId: 'alice', level: 10 }], 'alice', 30);
    expect(a[0]?.level).toBe(40);
  });

  it('caps at max', () => {
    const a = addAnger([{ targetId: 'alice', level: MAX_ANGER }], 'alice', 999);
    expect(a[0]?.level).toBe(MAX_ANGER);
  });

  it('decay reduces', () => {
    const a = tickDecay([{ targetId: 'alice', level: 10 }]);
    expect(a[0]?.level).toBe(9);
  });

  it('drops when at zero', () => {
    expect(tickDecay([{ targetId: 'alice', level: 1 }])).toEqual([]);
  });

  it('picks highest anger', () => {
    expect(
      primaryTarget([
        { targetId: 'alice', level: 10 },
        { targetId: 'bob', level: 50 },
      ]),
    ).toBe('bob');
  });

  it('suspect/ranged mode at 35 (wiki: suspect threshold)', () => {
    expect(RANGED_THRESHOLD).toBe(35);
    expect(attackMode(RANGED_THRESHOLD)).toBe('ranged');
  });

  it('melee mode at 80', () => {
    expect(attackMode(DIG_THRESHOLD)).toBe('melee');
  });

  it('passive below ranged', () => {
    expect(attackMode(10)).toBe('passive');
  });
});
