import { describe, it, expect } from 'vitest';
import {
  pollinate,
  canPollinateAgain,
  depositAtHive,
  flybyAgesCrop,
  POLLINATION_COOLDOWN_TICKS,
} from './bee_pollination';

describe('bee pollination', () => {
  it('pollinate sets nectar', () => {
    expect(pollinate({ hasNectar: false, ticksSincePollen: 9999 }).hasNectar).toBe(true);
  });

  it('cooldown blocks re-pollinate', () => {
    expect(canPollinateAgain({ hasNectar: false, ticksSincePollen: 100 })).toBe(false);
  });

  it('can again after cooldown', () => {
    expect(
      canPollinateAgain({ hasNectar: false, ticksSincePollen: POLLINATION_COOLDOWN_TICKS }),
    ).toBe(true);
  });

  it('deposit clears nectar + +1 honey', () => {
    const r = depositAtHive({ hasNectar: true, ticksSincePollen: 1000 });
    expect(r.deposit?.honeyLevelDelta).toBe(1);
    expect(r.bee.hasNectar).toBe(false);
  });

  it('deposit null when no nectar', () => {
    expect(depositAtHive({ hasNectar: false, ticksSincePollen: 0 }).deposit).toBeNull();
  });

  it('crop ages on lucky roll with nearby nectar-bee', () => {
    expect(flybyAgesCrop(true, () => 0)).toBe(true);
    expect(flybyAgesCrop(false, () => 0)).toBe(false);
    expect(flybyAgesCrop(true, () => 0.9)).toBe(false);
  });
});
