import { describe, it, expect } from 'vitest';
import { pullsAttached, slimeBlockChained, slimeAndHoneyCollide } from './sticky_piston_pull';

describe('sticky piston pull', () => {
  it('pulls solid', () => {
    expect(pullsAttached('stone')).toBe(true);
  });

  it('no pull air', () => {
    expect(pullsAttached('air')).toBe(false);
  });

  it('slime chains', () => {
    expect(slimeBlockChained('slime_block')).toBe(true);
    expect(slimeBlockChained('honey_block')).toBe(true);
  });

  it('slime+honey dont stick', () => {
    expect(slimeAndHoneyCollide('slime_block', 'honey_block')).toBe(true);
    expect(slimeAndHoneyCollide('slime_block', 'stone')).toBe(false);
  });
});
