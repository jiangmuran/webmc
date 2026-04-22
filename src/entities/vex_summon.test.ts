import { describe, it, expect } from 'vitest';
import {
  makeVex,
  tickVex,
  passable,
  canAttack,
  MIN_TTL,
  MAX_TTL,
  ATTACK_COOLDOWN_MS,
} from './vex_summon';

describe('vex', () => {
  it('ttl in range', () => {
    const v = makeVex(() => 0, 'e');
    expect(v.ttlTicks).toBe(MIN_TTL);
    const v2 = makeVex(() => 1, 'e');
    expect(v2.ttlTicks).toBe(MAX_TTL);
  });

  it('tick decrements and despawns', () => {
    const v = { ttlTicks: 2, summonerEvokerId: 'e', hasWeapon: true };
    expect(tickVex(v).despawned).toBe(false);
    expect(tickVex(v).despawned).toBe(true);
  });

  it('passable blocks', () => {
    expect(passable('webmc:stone')).toBe(true);
    expect(passable('webmc:bedrock')).toBe(false);
    expect(passable('webmc:nether_portal')).toBe(false);
  });

  it('attack cooldown', () => {
    expect(canAttack({ targetInRange: true, nowMs: 0, lastAttackMs: -Infinity })).toBe(true);
    expect(canAttack({ targetInRange: true, nowMs: 100, lastAttackMs: 0 })).toBe(false);
    expect(canAttack({ targetInRange: true, nowMs: ATTACK_COOLDOWN_MS + 1, lastAttackMs: 0 })).toBe(
      true,
    );
  });
});
