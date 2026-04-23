import { describe, it, expect } from 'vitest';
import { unlock, isUnlocked, prerequisitesMet } from './achievement_unlock';

describe('achievement unlock', () => {
  it('unlock marks', () => {
    const s = unlock({ unlocked: new Set() }, 'first_block');
    expect(isUnlocked(s, 'first_block')).toBe(true);
  });

  it('double unlock idempotent', () => {
    let s = unlock({ unlocked: new Set() }, 'x');
    s = unlock(s, 'x');
    expect(s.unlocked.size).toBe(1);
  });

  it('prereqs check', () => {
    const s = { unlocked: new Set(['a', 'b']) };
    expect(prerequisitesMet(s, ['a', 'b'])).toBe(true);
    expect(prerequisitesMet(s, ['a', 'c'])).toBe(false);
  });
});
