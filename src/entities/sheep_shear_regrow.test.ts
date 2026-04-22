import { describe, it, expect } from 'vitest';
import { shear, eatGrass, regrowsFromEating } from './sheep_shear_regrow';

describe('sheep shear regrow', () => {
  it('shear drops 1-3 wool', () => {
    const s = { sheared: false, color: 'white' };
    const r = shear(s, () => 0);
    expect(r?.wool).toBeGreaterThanOrEqual(1);
    expect(r?.wool).toBeLessThanOrEqual(3);
    expect(s.sheared).toBe(true);
  });

  it('cannot reshear', () => {
    expect(shear({ sheared: true, color: 'red' }, Math.random)).toBeNull();
  });

  it('grass regrows wool', () => {
    const s = { sheared: true, color: 'green' };
    const r = eatGrass(s, 'grass_block');
    expect(r.wasSheared).toBe(true);
    expect(r.consumedBlock).toBe('grass_block');
    expect(s.sheared).toBe(false);
  });

  it('other block does not consume', () => {
    const s = { sheared: true, color: 'white' };
    expect(eatGrass(s, 'other').consumedBlock).toBeNull();
    expect(s.sheared).toBe(true);
  });

  it('regrows only from grass types', () => {
    expect(regrowsFromEating('grass_block')).toBe(true);
    expect(regrowsFromEating('stone')).toBe(false);
  });
});
