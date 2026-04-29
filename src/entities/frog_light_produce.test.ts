import { describe, it, expect } from 'vitest';
import { froglightFor, magmaCubeEaten, FROGLIGHT_LIGHT_LEVEL } from './frog_light_produce';

describe('frog light produce', () => {
  it('temperate → pearlescent (wiki)', () => {
    expect(froglightFor('temperate')).toBe('pearlescent');
  });

  it('warm → ochre (wiki)', () => {
    expect(froglightFor('warm')).toBe('ochre');
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
