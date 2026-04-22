import { describe, it, expect } from 'vitest';
import { makeShield, raise, lower, disableByAxe, damageAfterBlock } from './shield_block';

describe('shield block', () => {
  it('blocks front melee after ready', () => {
    const s = makeShield();
    raise(s, 0);
    const r = damageAfterBlock(
      s,
      { nowMs: 300, attackerDirFromDefender: 'front', damageKind: 'melee' },
      8,
    );
    expect(r.blocked).toBe(true);
    expect(r.damage).toBe(0);
  });

  it('does not block before ready time', () => {
    const s = makeShield();
    raise(s, 0);
    const r = damageAfterBlock(
      s,
      { nowMs: 100, attackerDirFromDefender: 'front', damageKind: 'melee' },
      8,
    );
    expect(r.blocked).toBe(false);
    expect(r.damage).toBe(8);
  });

  it('side hits bypass', () => {
    const s = makeShield();
    raise(s, 0);
    const r = damageAfterBlock(
      s,
      { nowMs: 1000, attackerDirFromDefender: 'side', damageKind: 'melee' },
      8,
    );
    expect(r.blocked).toBe(false);
  });

  it('axe disables', () => {
    const s = makeShield();
    raise(s, 0);
    disableByAxe(s, 1000);
    const r = damageAfterBlock(
      s,
      { nowMs: 2000, attackerDirFromDefender: 'front', damageKind: 'melee' },
      8,
    );
    expect(r.blocked).toBe(false);
    const r2 = damageAfterBlock(
      s,
      { nowMs: 7000, attackerDirFromDefender: 'front', damageKind: 'melee' },
      8,
    );
    expect(r2.blocked).toBe(false);
  });

  it('fire not blocked', () => {
    const s = makeShield();
    raise(s, 0);
    const r = damageAfterBlock(
      s,
      { nowMs: 500, attackerDirFromDefender: 'front', damageKind: 'fire' },
      4,
    );
    expect(r.blocked).toBe(false);
  });

  it('lower restores vulnerability', () => {
    const s = makeShield();
    raise(s, 0);
    lower(s);
    const r = damageAfterBlock(
      s,
      { nowMs: 1000, attackerDirFromDefender: 'front', damageKind: 'melee' },
      8,
    );
    expect(r.blocked).toBe(false);
  });
});
