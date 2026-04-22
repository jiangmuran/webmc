import { describe, it, expect } from 'vitest';
import { profileFor, scaleMobDamage } from './difficulty_scaling';

describe('difficulty', () => {
  it('peaceful disables hostile', () => {
    expect(profileFor('peaceful').hostileMobsSpawn).toBe(false);
  });

  it('hard starves', () => {
    expect(profileFor('hard').hungerCanStarveToDeath).toBe(true);
    expect(profileFor('normal').hungerCanStarveToDeath).toBe(false);
  });

  it('mob damage scales', () => {
    expect(scaleMobDamage('peaceful', 4)).toBe(0);
    expect(scaleMobDamage('easy', 4)).toBe(2);
    expect(scaleMobDamage('normal', 4)).toBe(4);
    expect(scaleMobDamage('hard', 4)).toBe(6);
  });

  it('hard breaks doors', () => {
    expect(profileFor('hard').zombieBreaksDoor).toBe(true);
    expect(profileFor('normal').zombieBreaksDoor).toBe(false);
  });
});
