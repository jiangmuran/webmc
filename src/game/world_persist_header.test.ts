import { describe, it, expect } from 'vitest';
import { makeHeader, defaultRules, touch, WORLD_SCHEMA } from './world_persist_header';

describe('world header', () => {
  it('has schema version', () => {
    const h = makeHeader('My World', '42', 1000);
    expect(h.schemaVersion).toBe(WORLD_SCHEMA);
  });

  it('default rules', () => {
    const r = defaultRules();
    expect(r.doMobSpawning).toBe(true);
    expect(r.keepInventory).toBe(false);
  });

  it('touch updates lastPlayed', () => {
    const h = makeHeader('x', '1', 1000);
    touch(h, 5000);
    expect(h.lastPlayedAtMs).toBe(5000);
  });

  it('spawn at origin', () => {
    const h = makeHeader('x', '1', 0);
    expect(h.spawnPoint).toEqual({ x: 0, y: 64, z: 0 });
  });
});
