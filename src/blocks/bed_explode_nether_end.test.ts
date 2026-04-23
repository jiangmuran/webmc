import { describe, it, expect } from 'vitest';
import { explodesOnSleep, explosionPower, BED_EXPLOSION_POWER } from './bed_explode_nether_end';

describe('bed explode', () => {
  it('overworld safe', () => {
    expect(explodesOnSleep('overworld')).toBe(false);
  });

  it('nether explodes', () => {
    expect(explodesOnSleep('nether')).toBe(true);
  });

  it('end explodes', () => {
    expect(explodesOnSleep('end')).toBe(true);
  });

  it('power zero on overworld', () => {
    expect(explosionPower('overworld')).toBe(0);
  });

  it('power set on nether', () => {
    expect(explosionPower('nether')).toBe(BED_EXPLOSION_POWER);
  });
});
