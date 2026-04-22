import { describe, it, expect } from 'vitest';
import { makeVault, insertKey, requiredKey } from './vault_unlock';

describe('vault unlock', () => {
  it('trial key unlocks normal vault', () => {
    const v = makeVault();
    expect(insertKey(v, 'p1', 'trial_key').accepted).toBe(true);
  });

  it('wrong key rejected', () => {
    const v = makeVault();
    const r = insertKey(v, 'p1', 'ominous_trial_key');
    expect(r.accepted).toBe(false);
    expect(r.reason).toBe('wrong_key');
  });

  it('ominous needs ominous key', () => {
    const v = makeVault(true);
    expect(requiredKey(v)).toBe('ominous_trial_key');
    expect(insertKey(v, 'p1', 'trial_key').accepted).toBe(false);
    expect(insertKey(v, 'p1', 'ominous_trial_key').accepted).toBe(true);
  });

  it('once per player', () => {
    const v = makeVault();
    insertKey(v, 'p1', 'trial_key');
    const r = insertKey(v, 'p1', 'trial_key');
    expect(r.accepted).toBe(false);
    expect(r.reason).toBe('already_rewarded');
  });

  it('different players both get reward', () => {
    const v = makeVault();
    expect(insertKey(v, 'p1', 'trial_key').accepted).toBe(true);
    expect(insertKey(v, 'p2', 'trial_key').accepted).toBe(true);
  });
});
