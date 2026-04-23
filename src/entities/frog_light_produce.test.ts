import { describe, it, expect } from 'vitest';
import { froglightFor, magmaCubeEaten, FROGLIGHT_LIGHT_LEVEL } from './frog_light_produce';

describe('frog light produce', () => {
  it('temperate → ochre', () => {
    expect(froglightFor('temperate')).toBe('ochre');
  });

  it('warm → pearlescent', () => {
    expect(froglightFor('warm')).toBe('pearlescent');
  });

  it('cold → verdant', () => {
    expect(froglightFor('cold')).toBe('verdant');
  });

  it('only small magma cube eaten', () => {
    expect(magmaCubeEaten(1)).toBe(true);
    expect(magmaCubeEaten(2)).toBe(false);
  });

  it('light 15', () => {
    expect(FROGLIGHT_LIGHT_LEVEL).toBe(15);
  });
});
