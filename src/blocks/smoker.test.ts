import { describe, it, expect } from 'vitest';
import { isSmokerInput, smokerRecipeFor } from './smoker';

describe('smoker', () => {
  it('accepts food input', () => {
    expect(isSmokerInput('webmc:raw_beef')).toBe(true);
    expect(isSmokerInput('webmc:potato')).toBe(true);
  });

  it('rejects non-food', () => {
    expect(isSmokerInput('webmc:iron_ore')).toBe(false);
  });

  it('smokerRecipeFor cooks food in half the time', () => {
    const r = smokerRecipeFor('webmc:raw_beef');
    expect(r?.cookSec).toBe(5);
    expect(r?.output).toBe('webmc:cooked_beef');
  });

  it('smokerRecipeFor returns null for non-food', () => {
    expect(smokerRecipeFor('webmc:iron_ore')).toBeNull();
  });
});
