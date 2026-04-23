import { describe, it, expect } from 'vitest';
import { sanitize, isValid, toLowerKey, namesEqual } from './player_name_sanitize';

describe('player name sanitize', () => {
  it('strips spaces', () => {
    expect(sanitize('hello world')).toBe('hello_world');
  });

  it('removes special', () => {
    expect(sanitize('a!@#b')).toBe('ab');
  });

  it('caps length', () => {
    expect(sanitize('x'.repeat(100)).length).toBe(16);
  });

  it('isValid accepts normal', () => {
    expect(isValid('Steve')).toBe(true);
  });

  it('isValid rejects too short', () => {
    expect(isValid('ab')).toBe(false);
  });

  it('isValid rejects special', () => {
    expect(isValid('hello!')).toBe(false);
  });

  it('case-insensitive compare', () => {
    expect(namesEqual('STEVE', 'steve')).toBe(true);
  });

  it('lower key normalizes', () => {
    expect(toLowerKey('MIXED_Case')).toBe('mixed_case');
  });
});
