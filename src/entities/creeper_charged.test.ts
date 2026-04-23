import { describe, it, expect } from 'vitest';
import { strikeByLightning, explosionPower, dropsMobHead } from './creeper_charged';

describe('charged creeper', () => {
  it('lightning charges it', () => {
    expect(strikeByLightning({ charged: false }).charged).toBe(true);
  });

  it('charged doubles explosion', () => {
    expect(explosionPower({ charged: true })).toBeGreaterThan(explosionPower({ charged: false }));
  });

  it('drops head when charged', () => {
    expect(dropsMobHead({ charged: true })).toBe(true);
    expect(dropsMobHead({ charged: false })).toBe(false);
  });
});
