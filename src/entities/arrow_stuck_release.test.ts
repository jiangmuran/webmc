import { describe, it, expect } from 'vitest';
import { isDespawning, canBePickedUp, DESPAWN_TICKS } from './arrow_stuck_release';

describe('arrow stuck release', () => {
  it('despawns at cap', () => {
    expect(isDespawning({ stuckTicks: DESPAWN_TICKS, pickupState: 'allowed', shooter: 'p' })).toBe(
      true,
    );
  });

  it('survival picks allowed', () => {
    expect(canBePickedUp({ stuckTicks: 0, pickupState: 'allowed', shooter: 'p' }, false)).toBe(
      true,
    );
  });

  it('disallowed blocks pickup', () => {
    expect(canBePickedUp({ stuckTicks: 0, pickupState: 'disallowed', shooter: 'p' }, false)).toBe(
      false,
    );
  });

  it('creative-only requires creative', () => {
    expect(
      canBePickedUp({ stuckTicks: 0, pickupState: 'creative_only', shooter: 'p' }, false),
    ).toBe(false);
    expect(canBePickedUp({ stuckTicks: 0, pickupState: 'creative_only', shooter: 'p' }, true)).toBe(
      true,
    );
  });
});
