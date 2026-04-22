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

  it('projectile bounces off curled', () => {
    const a = { rolled: true, rollStartedMs: 0 };
    expect(incomingDamage(a, 5, 'projectile')).toBe(0);
  });

  it('curled melee halved', () => {
    const a = { rolled: true, rollStartedMs: 0 };
    expect(incomingDamage(a, 10, 'melee')).toBe(5);
  });

  it('scute cooldown', () => {
    expect(tryBrushScute(0, SCUTE_COOLDOWN_MS - 1)).toBe(false);
    expect(tryBrushScute(0, SCUTE_COOLDOWN_MS + 1)).toBe(true);
  });
});
