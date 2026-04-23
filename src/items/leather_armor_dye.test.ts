import { describe, it, expect } from 'vitest';
import { mix, clearedByCauldron, DEFAULT } from './leather_armor_dye';

describe('leather armor dye', () => {
  it('no dye keeps base', () => {
    expect(mix(DEFAULT, [])).toEqual(DEFAULT);
  });

  it('red dye tints', () => {
    const r = mix(DEFAULT, [{ r: 255, g: 0, b: 0 }]);
    expect(r.r).toBeGreaterThan(r.g);
  });

  it('cauldron resets to default', () => {
    expect(clearedByCauldron()).toEqual(DEFAULT);
  });

  it('clamps to 255', () => {
    const r = mix({ r: 250, g: 250, b: 250 }, [{ r: 255, g: 255, b: 255 }]);
    expect(r.r).toBeLessThanOrEqual(255);
  });
});
