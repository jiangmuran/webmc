import { describe, it, expect } from 'vitest';
import { phase, isMobSpawnTime, skyLightForTick, NOON, MIDNIGHT } from './time_of_day_cycle';

describe('time of day cycle', () => {
  it('noon is day', () => {
    expect(phase(NOON)).toBe('day');
  });

  it('midnight is night', () => {
    expect(phase(MIDNIGHT)).toBe('night');
  });

  it('sunset transitions', () => {
    expect(phase(12500)).toBe('dusk');
  });

  it('mobs spawn at night', () => {
    expect(isMobSpawnTime(MIDNIGHT)).toBe(true);
  });

  it('mobs do not spawn at noon', () => {
    expect(isMobSpawnTime(NOON)).toBe(false);
  });

  it('sky light max at noon', () => {
    expect(skyLightForTick(NOON)).toBe(15);
  });

  it('sky light low at midnight', () => {
    expect(skyLightForTick(MIDNIGHT)).toBe(4);
  });

  it('wraps past 24000', () => {
    expect(phase(25000)).toBe('day');
  });
});
