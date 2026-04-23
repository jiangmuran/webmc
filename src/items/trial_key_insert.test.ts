import { describe, it, expect } from 'vitest';
import { canInsert, insert, type VaultState } from './trial_key_insert';

const base: VaultState = { kind: 'normal', unlocked: false, claimedBy: [] };

describe('trial key insert', () => {
  it('normal vault accepts trial key', () => {
    expect(canInsert(base, 'trial_key', 'p')).toBe(true);
  });

  it('normal vault rejects ominous key', () => {
    expect(canInsert(base, 'ominous_trial_key', 'p')).toBe(false);
  });

  it('ominous vault needs ominous key', () => {
    const v: VaultState = { ...base, kind: 'ominous' };
    expect(canInsert(v, 'ominous_trial_key', 'p')).toBe(true);
    expect(canInsert(v, 'trial_key', 'p')).toBe(false);
  });

  it('insert records player', () => {
    const v = insert(base, 'trial_key', 'p');
    expect(v.unlocked).toBe(true);
    expect(v.claimedBy).toEqual(['p']);
  });

  it('double claim blocked', () => {
    const v = insert(base, 'trial_key', 'p');
    expect(canInsert(v, 'trial_key', 'p')).toBe(false);
  });
});
