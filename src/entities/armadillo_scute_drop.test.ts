import { describe, it, expect } from 'vitest';
import {
  rollNextScuteCooldown,
  brushYieldsScute,
  wolfArmoredDamage,
  SCUTE_DROP_MIN_TICKS,
  SCUTE_DROP_MAX_TICKS,
} from './armadillo_scute_drop';

describe('armadillo scute drop', () => {
  it('cooldown in range', () => {
    for (let i = 0; i < 50; i++) {
      const c = rollNextScuteCooldown(Math.random);
      expect(c).toBeGreaterThanOrEqual(SCUTE_DROP_MIN_TICKS);
      expect(c).toBeLessThanOrEqual(SCUTE_DROP_MAX_TICKS);
    }
  });

  it('brush only after cooldown', () => {
    expect(brushYieldsScute(0)).toBe(false);
    expect(brushYieldsScute(SCUTE_DROP_MIN_TICKS)).toBe(true);
  });

  it('wolf armor reduces damage', () => {
    expect(wolfArmoredDamage(10)).toBeCloseTo(8.8);
  });
});
