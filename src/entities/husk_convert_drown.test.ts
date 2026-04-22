import { describe, it, expect } from 'vitest';
import {
  onBiteHunger,
  drowns,
  underwaterTick,
  convertsInto,
  burnsInSun,
  HUSK_DROWN_TICKS,
} from './husk_convert_drown';

describe('husk convert drown', () => {
  it('hunger shorter on normal', () => {
    expect(onBiteHunger('normal')).toBeLessThan(onBiteHunger('hard'));
  });

  it('no drown early', () => {
    expect(drowns({ immersionTicks: 100 })).toBe(false);
  });

  it('drowns after threshold', () => {
    expect(drowns({ immersionTicks: HUSK_DROWN_TICKS })).toBe(true);
  });

  it('immersion increments in water', () => {
    expect(underwaterTick({ immersionTicks: 5 }, true).immersionTicks).toBe(6);
  });

  it('resets out of water', () => {
    expect(underwaterTick({ immersionTicks: 500 }, false).immersionTicks).toBe(0);
  });

  it('converts to zombie', () => {
    expect(convertsInto()).toBe('zombie');
  });

  it('does not burn in sun', () => {
    expect(burnsInSun()).toBe(false);
  });
});
