import { describe, it, expect } from 'vitest';
import {
  onBiteHunger,
  drowns,
  underwaterTick,
  convertsInto,
  burnsInSun,
  HUSK_DROWN_TICKS,
  HUSK_CONVERT_START_TICKS,
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

  it('drown threshold is 30 + 15 s per wiki', () => {
    // minecraft.wiki/w/Husk: 30 s start + 15 s conversion = 45 s.
    expect(HUSK_CONVERT_START_TICKS).toBe(600);
    expect(HUSK_DROWN_TICKS).toBe(900);
    // Just before threshold — still a husk.
    expect(drowns({ immersionTicks: HUSK_DROWN_TICKS - 1 })).toBe(false);
    expect(drowns({ immersionTicks: HUSK_DROWN_TICKS })).toBe(true);
  });
});
