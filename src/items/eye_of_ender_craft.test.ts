import { describe, it, expect } from 'vitest';
import {
  canCraft,
  resultCount,
  usableOnEndPortalFrame,
  eyesNeededToActivatePortal,
} from './eye_of_ender_craft';

describe('eye of ender craft', () => {
  it('valid recipe', () => {
    expect(canCraft({ blazePowder: 1, enderPearl: 1 })).toBe(true);
  });

  it('missing blaze powder', () => {
    expect(canCraft({ blazePowder: 0, enderPearl: 1 })).toBe(false);
  });

  it('result 1', () => {
    expect(resultCount()).toBe(1);
  });

  it('usable on frame', () => {
    expect(usableOnEndPortalFrame()).toBe(true);
  });

  it('12 eyes portal', () => {
    expect(eyesNeededToActivatePortal()).toBe(12);
  });
});
