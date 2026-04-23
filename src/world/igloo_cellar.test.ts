import { describe, it, expect } from 'vitest';
import { hasBasement, contents, findHalfBlockCount, IGLOO_BASEMENT_CHANCE } from './igloo_cellar';

describe('igloo cellar', () => {
  it('50% basement chance', () => {
    expect(IGLOO_BASEMENT_CHANCE).toBe(0.5);
    expect(hasBasement(() => 0)).toBe(true);
    expect(hasBasement(() => 0.9)).toBe(false);
  });

  it('basement includes zombie villager', () => {
    expect(contents({ hasBasement: true })).toContain('zombie_villager');
  });

  it('no basement no cure kit', () => {
    expect(contents({ hasBasement: false })).not.toContain('splash_potion_weakness');
  });

  it('trapdoor half blocks', () => {
    expect(findHalfBlockCount({ hasBasement: true })).toBeGreaterThan(0);
    expect(findHalfBlockCount({ hasBasement: false })).toBe(0);
  });
});
