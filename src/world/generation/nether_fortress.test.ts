import { describe, it, expect } from 'vitest';
import { FORTRESS_PIECES, fortressVolume, generateFortress } from './nether_fortress';

describe('nether fortress', () => {
  it('has a starting corridor piece', () => {
    const p = generateFortress({
      origin: { x: 0, y: 40, z: 0 },
      rng: () => 0.5,
      maxPieces: 1,
    });
    expect(p.length).toBe(1);
    expect(p[0]?.kind).toBe('corridor');
  });

  it('respects maxPieces budget', () => {
    const p = generateFortress({
      origin: { x: 0, y: 40, z: 0 },
      rng: () => 0.1,
      maxPieces: 5,
    });
    expect(p.length).toBeLessThanOrEqual(5);
  });

  it('blaze room is terminal (no children)', () => {
    expect(FORTRESS_PIECES.blaze_room.nextPool.length).toBe(0);
  });

  it('nether wart room is bigger than a corridor', () => {
    const wart = FORTRESS_PIECES.nether_wart_room;
    const corr = FORTRESS_PIECES.corridor;
    expect(wart.width * wart.depth).toBeGreaterThan(corr.width * corr.depth);
  });

  it('fortress volume sums per-piece boxes', () => {
    const v = fortressVolume([
      { kind: 'corridor', pos: { x: 0, y: 0, z: 0 } },
      { kind: 'blaze_room', pos: { x: 5, y: 0, z: 0 } },
    ]);
    expect(v).toBe(5 * 5 * 5 + 7 * 7 * 7);
  });

  it('generates multiple pieces with varied rng', () => {
    const p = generateFortress({
      origin: { x: 0, y: 40, z: 0 },
      rng: () => 0.2,
      maxPieces: 3,
    });
    expect(p.length).toBeGreaterThan(1);
  });
});
