import { describe, it, expect } from 'vitest';
import { burnsInSunlight } from './zombie_burn_day';

const base = {
  skyLight: 15,
  headInWater: false,
  wearingHelmet: false,
  isHusk: false,
  isDrowned: false,
};

describe('zombie burn day', () => {
  it('plain zombie burns', () => {
    expect(burnsInSunlight(base)).toBe(true);
  });

  it('husk does not burn', () => {
    expect(burnsInSunlight({ ...base, isHusk: true })).toBe(false);
  });

  it('water saves', () => {
    expect(burnsInSunlight({ ...base, headInWater: true })).toBe(false);
  });

  it('shade safe', () => {
    expect(burnsInSunlight({ ...base, skyLight: 0 })).toBe(false);
  });
});
