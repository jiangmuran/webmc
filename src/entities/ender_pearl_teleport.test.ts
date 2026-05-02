import { describe, it, expect } from 'vitest';
import {
  makeState,
  tryThrow,
  onPearlLand,
  COOLDOWN_MS,
  TELEPORT_DAMAGE,
} from './ender_pearl_teleport';

describe('ender pearl', () => {
  it('first throw ok', () => {
    const s = makeState();
    const r = tryThrow(s, { nowMs: 0, inCreative: false, inEnd: false, mountedOnEntity: false });
    expect(r.ok).toBe(true);
  });

  it('cooldown blocks', () => {
    const s = makeState();
    tryThrow(s, { nowMs: 0, inCreative: false, inEnd: false, mountedOnEntity: false });
    const r = tryThrow(s, { nowMs: 500, inCreative: false, inEnd: false, mountedOnEntity: false });
    expect(r.ok).toBe(false);
  });

  it('after cooldown', () => {
    const s = makeState();
    tryThrow(s, { nowMs: 0, inCreative: false, inEnd: false, mountedOnEntity: false });
    const r = tryThrow(s, {
      nowMs: COOLDOWN_MS + 1,
      inCreative: false,
      inEnd: false,
      mountedOnEntity: false,
    });
    expect(r.ok).toBe(true);
  });

  it('mounted blocks', () => {
    const s = makeState();
    const r = tryThrow(s, { nowMs: 0, inCreative: false, inEnd: false, mountedOnEntity: true });
    expect(r.ok).toBe(false);
  });

  it('creative refunds', () => {
    const s = makeState();
    const r = tryThrow(s, { nowMs: 0, inCreative: true, inEnd: false, mountedOnEntity: false });
    if (r.ok) expect(r.refundPearl).toBe(true);
  });

  it('land teleports with damage', () => {
    const r = onPearlLand({ inEnd: false, hitValid: true });
    expect(r.teleport).toBe(true);
    expect(r.damageToThrower).toBe(TELEPORT_DAMAGE);
  });

  it('end still takes damage (wiki: damage applies in all dimensions)', () => {
    expect(onPearlLand({ inEnd: true, hitValid: true }).damageToThrower).toBe(TELEPORT_DAMAGE);
  });
});
