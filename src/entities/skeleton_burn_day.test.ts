import { describe, it, expect } from 'vitest';
import { burnsInSunlight } from './skeleton_burn_day';

const base = {
  skyLight: 15,
  headInWater: false,
  wearingHelmet: false,
  isStray: false,
  isBogged: false,
  isSkeletonHorse: false,
};

describe('skeleton burn day', () => {
  it('burns in light', () => {
    expect(burnsInSunlight(base)).toBe(true);
  });

  it('helmet saves', () => {
    expect(burnsInSunlight({ ...base, wearingHelmet: true })).toBe(false);
  });

  it('water saves', () => {
    expect(burnsInSunlight({ ...base, headInWater: true })).toBe(false);
  });

  it('shade safe', () => {
    expect(burnsInSunlight({ ...base, skyLight: 5 })).toBe(false);
  });

  it('skeleton horse immune', () => {
    expect(burnsInSunlight({ ...base, isSkeletonHorse: true })).toBe(false);
  });
});
