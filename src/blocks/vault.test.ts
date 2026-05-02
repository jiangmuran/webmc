import { describe, it, expect } from 'vitest';
import { makeVault, rollVaultLoot, tickVault, tryUnlockVault } from './vault';

describe('vault', () => {
  it('refuses without key', () => {
    const v = makeVault();
    expect(tryUnlockVault(v, { playerId: 'p1', hasKey: false }).reason).toBe('no_key');
  });

  it('accepts with key', () => {
    const v = makeVault();
    const r = tryUnlockVault(v, { playerId: 'p1', hasKey: true });
    expect(r.accepted).toBe(true);
    expect(v.status).toBe('unlocking');
  });

  it('double-claim rejected after status resets', () => {
    const v = makeVault();
    tryUnlockVault(v, { playerId: 'p1', hasKey: true });
    // simulate vault returning to active without clearing unlockedBy
    v.status = 'active';
    expect(tryUnlockVault(v, { playerId: 'p1', hasKey: true }).reason).toBe('already_claimed');
  });

  it('inactive vault refuses', () => {
    const v = makeVault();
    v.status = 'inactive';
    expect(tryUnlockVault(v, { playerId: 'p1', hasKey: true }).reason).toBe('not_active');
  });

  it('tick transitions through eject', () => {
    const v = makeVault();
    tryUnlockVault(v, { playerId: 'p1', hasKey: true });
    tickVault(v, 2.1);
    expect(v.status).toBe('ejecting');
    const r = tickVault(v, 1.1);
    expect(r).toBe('ejected');
    expect(v.status).toBe('inactive');
  });

  it('loot roll picks an entry', () => {
    const e = rollVaultLoot(false, 0.1);
    expect(e).not.toBeNull();
  });

  it('heavy_core is ominous-only', () => {
    // deterministic scan: try all rolls to confirm heavy_core never appears without ominous
    for (let r = 0; r < 1; r += 0.01) {
      const entry = rollVaultLoot(false, r);
      if (entry?.item === 'webmc:heavy_core') throw new Error('should not happen');
    }
    expect(true).toBe(true);
  });

  it('flow_armor_trim is ominous-only (wiki); bolt_armor_trim is regular', () => {
    // Wiki: flow drops only from ominous vaults; bolt drops from
    // standard vaults (and trial chamber chests).
    let sawBolt = false;
    let sawFlow = false;
    for (let r = 0; r < 1; r += 0.001) {
      const entry = rollVaultLoot(false, r);
      if (entry?.item === 'webmc:flow_armor_trim') {
        throw new Error('flow trim should not drop from regular vault');
      }
      if (entry?.item === 'webmc:bolt_armor_trim') sawBolt = true;
    }
    for (let r = 0; r < 1; r += 0.001) {
      const entry = rollVaultLoot(true, r);
      if (entry?.item === 'webmc:flow_armor_trim') sawFlow = true;
    }
    expect(sawBolt).toBe(true);
    expect(sawFlow).toBe(true);
  });
});
