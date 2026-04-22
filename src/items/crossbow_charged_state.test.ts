import { describe, it, expect } from 'vitest';
import {
  makeCrossbow,
  beginCharge,
  releaseCharge,
  fire,
  chargeTimeMs,
  BASE_CHARGE_MS,
} from './crossbow_charged_state';

describe('crossbow charge', () => {
  it('quick charge reduces time, min 250ms', () => {
    expect(chargeTimeMs(0)).toBe(BASE_CHARGE_MS);
    expect(chargeTimeMs(1)).toBe(1000);
    expect(chargeTimeMs(5)).toBe(250);
  });

  it('full charge cycle', () => {
    const s = makeCrossbow();
    expect(beginCharge(s, { nowMs: 0, ammo: 'arrow' })).toBe(true);
    expect(releaseCharge(s, { nowMs: 1300, quickChargeLevel: 0 })).toBe('charged');
    expect(fire(s)).toBe('arrow');
    expect(s.phase).toBe('idle');
  });

  it('early release cancels', () => {
    const s = makeCrossbow();
    beginCharge(s, { nowMs: 0, ammo: 'arrow' });
    expect(releaseCharge(s, { nowMs: 500, quickChargeLevel: 0 })).toBe('cancelled');
    expect(fire(s)).toBeNull();
  });

  it('cannot fire uncharged', () => {
    const s = makeCrossbow();
    expect(fire(s)).toBeNull();
  });

  it('cannot begin while charged', () => {
    const s = makeCrossbow();
    beginCharge(s, { nowMs: 0, ammo: 'arrow' });
    releaseCharge(s, { nowMs: 2000, quickChargeLevel: 0 });
    expect(beginCharge(s, { nowMs: 3000, ammo: 'firework' })).toBe(false);
  });
});
