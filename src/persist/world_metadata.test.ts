import { describe, it, expect } from 'vitest';
import {
  accumulatePlaytime,
  addKnownPlayer,
  freshWorld,
  setGamerule,
  WORLD_META_VERSION,
} from './world_metadata';

describe('world metadata', () => {
  it('fresh world is well-formed', () => {
    const w = freshWorld('test', '1234', 1000);
    expect(w.version).toBe(WORLD_META_VERSION);
    expect(w.dimensions).toContain('overworld');
    expect(w.gamerules['doFireTick']).toBe('true');
  });

  it('adds a new known player', () => {
    const w0 = freshWorld('t', '0', 0);
    const w1 = addKnownPlayer(w0, 'uuid1', 'alice', 10);
    expect(w1.knownPlayers.length).toBe(1);
  });

  it('updates existing player name on relogin', () => {
    const w0 = addKnownPlayer(freshWorld('t', '0', 0), 'uuid1', 'alice', 10);
    const w1 = addKnownPlayer(w0, 'uuid1', 'bob', 20);
    expect(w1.knownPlayers[0]?.name).toBe('bob');
    expect(w1.knownPlayers.length).toBe(1);
  });

  it('setGamerule mutates only that rule', () => {
    const w0 = freshWorld('t', '0', 0);
    const w1 = setGamerule(w0, 'keepInventory', 'true');
    expect(w1.gamerules['keepInventory']).toBe('true');
    expect(w1.gamerules['doFireTick']).toBe('true');
  });

  it('accumulatePlaytime sums', () => {
    const w0 = freshWorld('t', '0', 0);
    const w1 = accumulatePlaytime(w0, 60);
    const w2 = accumulatePlaytime(w1, 30);
    expect(w2.totalPlaytimeSec).toBe(90);
  });

  it('preserves immutability', () => {
    const w0 = freshWorld('t', '0', 0);
    const w1 = addKnownPlayer(w0, 'u', 'n', 1);
    expect(w0.knownPlayers.length).toBe(0);
    expect(w1.knownPlayers.length).toBe(1);
  });
});
