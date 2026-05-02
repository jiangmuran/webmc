import { describe, it, expect } from 'vitest';
import {
  makeArmadillo,
  updateCurl,
  incomingDamage,
  tryBrushScute,
  UNCURL_DELAY_MS,
  SCUTE_COOLDOWN_MS,
} from './armadillo_curl';

describe('armadillo', () => {
  it('curls on threat', () => {
    const a = makeArmadillo();
    updateCurl(a, { hostileNearby: true, playerSprintingNearby: false, nowMs: 0 });
    expect(a.rolled).toBe(true);
  });

  it('uncurls after delay with no threat', () => {
    const a = makeArmadillo();
    updateCurl(a, { hostileNearby: true, playerSprintingNearby: false, nowMs: 0 });
    updateCurl(a, {
      hostileNearby: false,
      playerSprintingNearby: false,
      nowMs: UNCURL_DELAY_MS + 1,
    });
    expect(a.rolled).toBe(false);
  });

  it('curled damage = (raw - 1) / 2 for all sources (wiki)', () => {
    const a = { rolled: true, rollStartedMs: 0 };
    // 5 → (5-1)/2 = 2 — projectile is no longer immune
    expect(incomingDamage(a, 5, 'projectile')).toBe(2);
    // 10 → (10-1)/2 = 4.5 — melee no longer flat 50%
    expect(incomingDamage(a, 10, 'melee')).toBe(4.5);
    // 9 → (9-1)/2 = 4 — same uniform formula for 'other'
    expect(incomingDamage(a, 9, 'other')).toBe(4);
  });

  it('curled clamps at 0 for ≤1 damage', () => {
    const a = { rolled: true, rollStartedMs: 0 };
    expect(incomingDamage(a, 1, 'melee')).toBe(0);
    expect(incomingDamage(a, 0, 'projectile')).toBe(0);
  });

  it('scute cooldown', () => {
    expect(tryBrushScute(0, SCUTE_COOLDOWN_MS - 1)).toBe(false);
    expect(tryBrushScute(0, SCUTE_COOLDOWN_MS + 1)).toBe(true);
  });
});
