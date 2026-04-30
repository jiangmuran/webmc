import { describe, it, expect } from 'vitest';
import { anvilFallDamage, makeAnvil, maybeDegrade } from './anvil_fall';

describe('anvil fall', () => {
  it('0-1 block fall does 0 damage', () => {
    expect(anvilFallDamage(0)).toBe(0);
    expect(anvilFallDamage(1)).toBe(0);
  });

  it('10 block fall does 18 damage', () => {
    expect(anvilFallDamage(10)).toBe(18);
  });

  it('cap at 40 for extreme falls (wiki)', () => {
    expect(anvilFallDamage(1000)).toBe(40);
  });

  it('tier progresses intact → chipped → damaged → broken', () => {
    const a = makeAnvil();
    // 10-block fall → 50% chance, rng 0.01 always triggers.
    maybeDegrade(a, 10, () => 0.01);
    expect(a.tier).toBe('chipped');
    maybeDegrade(a, 10, () => 0.01);
    expect(a.tier).toBe('damaged');
    maybeDegrade(a, 10, () => 0.01);
    expect(a.tier).toBe('broken');
    maybeDegrade(a, 10, () => 0.01);
    expect(a.tier).toBe('broken');
  });

  it('rng above chance leaves tier', () => {
    const a = makeAnvil();
    // 10-block fall → 50% chance, rng 0.9 stays.
    maybeDegrade(a, 10, () => 0.9);
    expect(a.tier).toBe('intact');
  });

  it('1-block fall cannot degrade (wiki: only falls > 1 block)', () => {
    const a = makeAnvil();
    maybeDegrade(a, 1, () => 0); // rng 0 would always degrade if chance > 0
    expect(a.tier).toBe('intact');
  });

  it('degrade chance scales 5% × blocks fallen', () => {
    const a = makeAnvil();
    // 4-block fall → 20% chance, rng 0.21 just above → no degrade.
    maybeDegrade(a, 4, () => 0.21);
    expect(a.tier).toBe('intact');
    // rng 0.19 just below → degrade.
    maybeDegrade(a, 4, () => 0.19);
    expect(a.tier).toBe('chipped');
  });
});
