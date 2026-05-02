import { describe, it, expect } from 'vitest';
import {
  onPlayerAttack,
  stingTarget,
  diesSoonAfterSting,
  fleeAfterSting,
  ANGER_TICKS_MIN,
  ANGER_TICKS_MAX,
} from './bee_anger_flee';

describe('bee anger flee', () => {
  it('attack makes angry (wiki: 20–39s = 400–780 ticks, rand=0 → min)', () => {
    expect(onPlayerAttack({ angerTicks: 0, stung: false }, () => 0).angerTicks).toBe(
      ANGER_TICKS_MIN,
    );
  });

  it('attack with rand near 1 → max wiki anger (39s = 780 ticks)', () => {
    // span is 381 (inclusive), so rand=0.999 → floor(0.999*381) = 380 → 400+380 = 780
    expect(onPlayerAttack({ angerTicks: 0, stung: false }, () => 0.999).angerTicks).toBe(
      ANGER_TICKS_MAX,
    );
  });

  it('attack rolls within wiki range', () => {
    for (let i = 0; i < 20; i++) {
      const t = onPlayerAttack({ angerTicks: 0, stung: false }, Math.random).angerTicks;
      expect(t).toBeGreaterThanOrEqual(ANGER_TICKS_MIN);
      expect(t).toBeLessThanOrEqual(ANGER_TICKS_MAX);
    }
  });

  it('sting clears anger', () => {
    expect(stingTarget({ angerTicks: 400, stung: false }).angerTicks).toBe(0);
  });

  it('stung bee flees + dies', () => {
    const b = stingTarget({ angerTicks: 0, stung: false });
    expect(fleeAfterSting(b)).toBe(true);
    expect(diesSoonAfterSting(b)).toBe(true);
  });
});
