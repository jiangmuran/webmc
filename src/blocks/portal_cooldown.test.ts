import { describe, it, expect } from 'vitest';
import { cooldownTicks, canTravelAgain, PLAYER_COOLDOWN } from './portal_cooldown';

describe('portal cooldown', () => {
  it('player vs mob', () => {
    expect(cooldownTicks({ lastPortalTick: 0, isPlayer: true })).toBe(PLAYER_COOLDOWN);
    expect(cooldownTicks({ lastPortalTick: 0, isPlayer: false })).toBeGreaterThan(PLAYER_COOLDOWN);
  });

  it('allows travel after cooldown', () => {
    expect(canTravelAgain({ lastPortalTick: 0, isPlayer: true }, PLAYER_COOLDOWN)).toBe(true);
  });

  it('blocks while on cooldown', () => {
    expect(canTravelAgain({ lastPortalTick: 0, isPlayer: true }, 100)).toBe(false);
  });
});
