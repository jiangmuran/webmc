import { describe, it, expect } from 'vitest';
import {
  canRequestGolem,
  MIN_VILLAGERS_FOR_REQUEST,
  REQUEST_COOLDOWN_TICKS,
} from './villager_iron_golem_request';

describe('villager iron golem request', () => {
  it('below min villagers no', () => {
    expect(
      canRequestGolem({
        villagersCount: 1,
        golemsNearby: 0,
        recentlyAttacked: true,
        timeSinceLastRequest: REQUEST_COOLDOWN_TICKS,
      }),
    ).toBe(false);
  });

  it('existing golem no', () => {
    expect(
      canRequestGolem({
        villagersCount: MIN_VILLAGERS_FOR_REQUEST + 1,
        golemsNearby: 1,
        recentlyAttacked: true,
        timeSinceLastRequest: REQUEST_COOLDOWN_TICKS,
      }),
    ).toBe(false);
  });

  it('no threat no request', () => {
    expect(
      canRequestGolem({
        villagersCount: MIN_VILLAGERS_FOR_REQUEST + 1,
        golemsNearby: 0,
        recentlyAttacked: false,
        timeSinceLastRequest: REQUEST_COOLDOWN_TICKS,
      }),
    ).toBe(false);
  });

  it('under attack requests', () => {
    expect(
      canRequestGolem({
        villagersCount: MIN_VILLAGERS_FOR_REQUEST + 1,
        golemsNearby: 0,
        recentlyAttacked: true,
        timeSinceLastRequest: REQUEST_COOLDOWN_TICKS,
      }),
    ).toBe(true);
  });
});
