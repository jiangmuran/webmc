import { describe, it, expect } from 'vitest';
import {
  useCarrotOnStick,
  speed,
  tick,
  BOOST_DURATION_TICKS,
  BASE_SPEED,
  BOOST_SPEED,
  type PigMount,
} from './carrot_on_stick_pig_speed';

const base: PigMount = {
  hasSaddle: true,
  hasCarrotOnStick: true,
  boostTicksRemaining: 0,
};

describe('carrot on a stick pig', () => {
  it('no saddle no speed', () => {
    expect(speed({ ...base, hasSaddle: false })).toBe(0);
  });

  it('base speed with saddle', () => {
    expect(speed(base)).toBe(BASE_SPEED);
  });

  it('boost after carrot use', () => {
    expect(speed(useCarrotOnStick(base))).toBe(BOOST_SPEED);
  });

  it('boost decays', () => {
    const s = useCarrotOnStick(base);
    const tPlus1 = tick(s);
    expect(tPlus1.boostTicksRemaining).toBe(BOOST_DURATION_TICKS - 1);
  });

  it('tick clamps at zero', () => {
    expect(tick(base).boostTicksRemaining).toBe(0);
  });

  it('unsaddled ignores carrot', () => {
    const noSaddle = useCarrotOnStick({ ...base, hasSaddle: false });
    expect(noSaddle.boostTicksRemaining).toBe(0);
  });
});
