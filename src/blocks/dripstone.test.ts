import { describe, it, expect } from 'vitest';
import { dripProduced, fallDamageOnTip } from './dripstone';

describe('dripstone', () => {
  it('small fall still deals 2 damage minimum', () => {
    expect(fallDamageOnTip(0)).toBe(2);
    expect(fallDamageOnTip(1)).toBe(4);
  });

  it('cap at 40 damage for huge falls', () => {
    expect(fallDamageOnTip(1000)).toBe(40);
  });

  it('water drip produces water with 5s interval', () => {
    const r = dripProduced({ aboveFluid: 'water' });
    expect(r.fluid).toBe('water');
    expect(r.intervalSec).toBe(5);
  });

  it('lava drip is slower', () => {
    const r = dripProduced({ aboveFluid: 'lava' });
    expect(r.fluid).toBe('lava');
    expect(r.intervalSec).toBeGreaterThan(dripProduced({ aboveFluid: 'water' }).intervalSec);
  });

  it('no fluid above → no drip', () => {
    expect(dripProduced({ aboveFluid: null }).fluid).toBeNull();
  });
});
