import { describe, it, expect } from 'vitest';
import { beginRespawn, detectRespawnConfig, makeRespawnState, tickRespawn } from './dragon_respawn';

describe('dragon respawn', () => {
  it('detects 4 cardinal crystals', () => {
    const ok = detectRespawnConfig({
      fountainCenter: { x: 0, y: 60, z: 0 },
      crystalPositions: [
        { x: 4, y: 60, z: 0 },
        { x: -4, y: 60, z: 0 },
        { x: 0, y: 60, z: 4 },
        { x: 0, y: 60, z: -4 },
      ],
    });
    expect(ok).toBe(true);
  });

  it('refuses fewer than 4 crystals', () => {
    const ok = detectRespawnConfig({
      fountainCenter: { x: 0, y: 60, z: 0 },
      crystalPositions: [{ x: 4, y: 60, z: 0 }],
    });
    expect(ok).toBe(false);
  });

  it('phases progress through crystals_rising → materialize → roar → done', () => {
    const s = makeRespawnState();
    beginRespawn(s);
    tickRespawn(s, 5);
    expect(s.phase).toBe('dragon_materialize');
    tickRespawn(s, 4);
    expect(s.phase).toBe('roar');
    tickRespawn(s, 3);
    expect(s.phase).toBe('done');
  });

  it('idle stays idle without beginRespawn', () => {
    const s = makeRespawnState();
    tickRespawn(s, 10);
    expect(s.phase).toBe('idle');
  });
});
