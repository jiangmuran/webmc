import { describe, it, expect } from 'vitest';
import {
  isValidName,
  appliedName,
  namedMobSkipsDespawn,
  dinnerboneFlipsRendering,
  MAX_NAME_LENGTH,
} from './name_tag_rename';

describe('name tag rename', () => {
  it('rejects empty', () => {
    expect(isValidName('')).toBe(false);
  });

  it('caps length', () => {
    expect(isValidName('a'.repeat(MAX_NAME_LENGTH + 1))).toBe(false);
  });

  it('applies name', () => {
    expect(appliedName({ tagName: 'Bob', targetHasName: false })).toBe('Bob');
  });

  it('named mob persists', () => {
    expect(namedMobSkipsDespawn()).toBe(true);
  });

  it('Dinnerbone flips', () => {
    expect(dinnerboneFlipsRendering('Dinnerbone')).toBe(true);
    expect(dinnerboneFlipsRendering('Steve')).toBe(false);
  });
});
