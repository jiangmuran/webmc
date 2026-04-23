import { describe, it, expect } from 'vitest';
import { regenHpTick, takeDamage, isBroken, HP_MAX } from './boat_waterlog_sink';

describe('boat waterlog sink', () => {
  it('regen up to max', () => {
    expect(regenHpTick({ hp: 5, inWater: true }).hp).toBeGreaterThan(5);
  });

  it('full hp no change', () => {
    expect(regenHpTick({ hp: HP_MAX, inWater: true })).toEqual({ hp: HP_MAX, inWater: true });
  });

  it('damage reduces', () => {
    expect(takeDamage({ hp: 5, inWater: true }, 3).hp).toBe(2);
  });

  it('broken at 0', () => {
    expect(isBroken({ hp: 0, inWater: true })).toBe(true);
  });
});
