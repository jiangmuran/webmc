import { describe, it, expect } from 'vitest';
import { pickMapTarget, EXPLORER_MAP_SCALE } from './cartographer_map_trade';

describe('cartographer map trade', () => {
  it('nearest unknown wins', () => {
    const r = pickMapTarget(
      {
        playerX: 0,
        playerZ: 0,
        structures: [
          { kind: 'monument', x: 100, z: 0, known: false },
          { kind: 'monument', x: 1000, z: 0, known: false },
        ],
      },
      'monument',
    );
    expect(r?.x).toBe(100);
  });

  it('skips known', () => {
    const r = pickMapTarget(
      {
        playerX: 0,
        playerZ: 0,
        structures: [{ kind: 'monument', x: 10, z: 0, known: true }],
      },
      'monument',
    );
    expect(r).toBeNull();
  });

  it('skips wrong kind', () => {
    const r = pickMapTarget(
      {
        playerX: 0,
        playerZ: 0,
        structures: [{ kind: 'mansion', x: 10, z: 0, known: false }],
      },
      'monument',
    );
    expect(r).toBeNull();
  });

  it('map scale > 1', () => {
    expect(EXPLORER_MAP_SCALE).toBeGreaterThan(1);
  });
});
