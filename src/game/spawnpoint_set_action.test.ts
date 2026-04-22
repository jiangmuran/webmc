import { describe, it, expect } from 'vitest';
import { makeSpawnState, applySpawnCmd, resolveSpawn } from './spawnpoint_set_action';

describe('spawnpoint cmd', () => {
  it('resolves world spawn by default', () => {
    const s = makeSpawnState({ x: 0, y: 64, z: 0 });
    expect(resolveSpawn(s, 'Steve')).toEqual({ x: 0, y: 64, z: 0 });
  });

  it('set player overrides', () => {
    const s = makeSpawnState({ x: 0, y: 64, z: 0 });
    applySpawnCmd(s, { kind: 'set_player', playerId: 'Steve', pos: { x: 10, y: 70, z: 10 } });
    expect(resolveSpawn(s, 'Steve')).toEqual({ x: 10, y: 70, z: 10 });
  });

  it('clear player returns to world', () => {
    const s = makeSpawnState({ x: 0, y: 64, z: 0 });
    applySpawnCmd(s, { kind: 'set_player', playerId: 'Steve', pos: { x: 5, y: 5, z: 5 } });
    applySpawnCmd(s, { kind: 'clear_player', playerId: 'Steve' });
    expect(resolveSpawn(s, 'Steve')).toEqual({ x: 0, y: 64, z: 0 });
  });

  it('clear non-existent errors', () => {
    const s = makeSpawnState({ x: 0, y: 64, z: 0 });
    const r = applySpawnCmd(s, { kind: 'clear_player', playerId: 'Steve' });
    expect(r.ok).toBe(false);
  });

  it('get missing', () => {
    const s = makeSpawnState({ x: 0, y: 64, z: 0 });
    expect(applySpawnCmd(s, { kind: 'get_player', playerId: 'x' }).ok).toBe(false);
  });

  it('set world moves default', () => {
    const s = makeSpawnState({ x: 0, y: 64, z: 0 });
    applySpawnCmd(s, { kind: 'set_world', pos: { x: 100, y: 64, z: 100 } });
    expect(resolveSpawn(s, 'anyone')).toEqual({ x: 100, y: 64, z: 100 });
  });
});
