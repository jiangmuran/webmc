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

  it('cap at 20 for extreme falls', () => {
    expect(anvilFallDamage(1000)).toBe(20);
  });

  it('tier progresses intact → chipped → damaged → broken', () => {
    const a = makeAnvil();
    // Force the rng to always trigger degrade.
    maybeDegrade(a, () => 0.01);
    expect(a.tier).toBe('chipped');
    maybeDegrade(a, () => 0.01);
    expect(a.tier).toBe('damaged');
    maybeDegrade(a, () => 0.01);
    expect(a.tier).toBe('broken');
    maybeDegrade(a, () => 0.01);
    expect(a.tier).toBe('broken');
  });

  it('rng above chance leaves tier', () => {
    const a = makeAnvil();
    maybeDegrade(a, () => 0.9);
    expect(a.tier).toBe('intact');
  });
});
