import { describe, it, expect } from 'vitest';
import { emptySlotsAllowed, isSlotDisabled, triggersWhenAllFilled } from './crafter_recipe_lock';

describe('crafter recipe lock', () => {
  it('counts unlocked', () => {
    expect(
      emptySlotsAllowed([
        { locked: true, hasItem: true },
        { locked: false, hasItem: false },
        { locked: false, hasItem: true },
      ]),
    ).toBe(2);
  });

  it('locked empty is disabled', () => {
    expect(isSlotDisabled({ locked: true, hasItem: false })).toBe(true);
    expect(isSlotDisabled({ locked: false, hasItem: false })).toBe(false);
  });

  it('fires when unlocked slots all filled', () => {
    expect(
      triggersWhenAllFilled([
        { locked: true, hasItem: false },
        { locked: false, hasItem: true },
      ]),
    ).toBe(true);
    expect(
      triggersWhenAllFilled([
        { locked: false, hasItem: false },
        { locked: false, hasItem: true },
      ]),
    ).toBe(false);
  });
});
