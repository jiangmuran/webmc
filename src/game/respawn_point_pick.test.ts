import { describe, it, expect } from 'vitest';
import { pickRespawn, type RespawnSources } from './respawn_point_pick';

const worldSpawn = { x: 0, y: 64, z: 0 };

function base(): RespawnSources {
  return { anchor: null, bed: null, worldSpawn };
}

describe('respawn picker', () => {
  it('anchor first', () => {
    const s = base();
    s.anchor = { dim: 'nether', pos: { x: 10, y: 70, z: 10 }, charges: 1 };
    s.bed = { dim: 'overworld', pos: { x: 0, y: 0, z: 0 }, valid: true };
    const r = pickRespawn(s);
    expect(r.source).toBe('anchor');
    expect(r.anchorChargeConsumed).toBe(true);
  });

  it('bed when no anchor', () => {
    const s = base();
    s.bed = { dim: 'overworld', pos: { x: 1, y: 0, z: 2 }, valid: true };
    expect(pickRespawn(s).source).toBe('bed');
  });

  it('invalid bed drops to world spawn with notice', () => {
    const s = base();
    s.bed = { dim: 'overworld', pos: { x: 1, y: 0, z: 2 }, valid: false };
    const r = pickRespawn(s);
    expect(r.source).toBe('world_spawn');
    expect(r.bedInvalidatedNotice).toBe(true);
  });

  it('empty anchor falls through', () => {
    const s = base();
    s.anchor = { dim: 'nether', pos: { x: 1, y: 0, z: 2 }, charges: 0 };
    expect(pickRespawn(s).source).toBe('world_spawn');
  });
});
