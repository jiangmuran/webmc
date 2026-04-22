import { describe, it, expect } from 'vitest';
import {
  launchVelocity,
  triggersOnSmashOnly,
  treasureOnly,
  chainable,
  WIND_BURST_MAX,
} from './wind_burst_mace';

describe('wind burst mace', () => {
  it('level 0 no launch', () => {
    expect(launchVelocity(0)).toBe(0);
  });

  it('level 3 launches', () => {
    expect(launchVelocity(3)).toBeGreaterThan(0);
  });

  it('caps at 3', () => {
    expect(launchVelocity(10)).toBe(launchVelocity(WIND_BURST_MAX));
  });

  it('smash only', () => {
    expect(triggersOnSmashOnly()).toBe(true);
  });

  it('treasure', () => {
    expect(treasureOnly()).toBe(true);
  });

  it('chainable for air combos', () => {
    expect(chainable()).toBe(true);
  });
});
