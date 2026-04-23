import { describe, it, expect } from 'vitest';
import { canOpen, setLock, LOCK_ERROR_MESSAGE } from './container_lock';

describe('container lock', () => {
  it('unlocked opens freely', () => {
    expect(canOpen({ lock: null }, null)).toBe(true);
    expect(canOpen({ lock: null }, 'anything')).toBe(true);
  });

  it('locked requires matching held name', () => {
    expect(canOpen({ lock: 'key' }, 'key')).toBe(true);
    expect(canOpen({ lock: 'key' }, 'wrong')).toBe(false);
    expect(canOpen({ lock: 'key' }, null)).toBe(false);
  });

  it('setLock updates', () => {
    expect(setLock({ lock: null }, 'new_key').lock).toBe('new_key');
  });

  it('error message', () => {
    expect(LOCK_ERROR_MESSAGE).toContain('Locked');
  });
});
