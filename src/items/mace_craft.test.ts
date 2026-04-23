import { describe, it, expect } from 'vitest';
import { canCraft, MACE_BASE_DAMAGE, MACE_ATTACK_SPEED, MACE_DURABILITY } from './mace_craft';

describe('mace craft', () => {
  it('craft with both inputs', () => {
    expect(canCraft({ template: 'none', heavyCore: true, breezeRod: true })).toBe(true);
  });

  it('missing core rejects', () => {
    expect(canCraft({ template: 'none', heavyCore: false, breezeRod: true })).toBe(false);
  });

  it('missing rod rejects', () => {
    expect(canCraft({ template: 'none', heavyCore: true, breezeRod: false })).toBe(false);
  });

  it('base stats', () => {
    expect(MACE_BASE_DAMAGE).toBeGreaterThan(0);
    expect(MACE_ATTACK_SPEED).toBeLessThan(1);
    expect(MACE_DURABILITY).toBeGreaterThan(100);
  });
});
