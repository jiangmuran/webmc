import { describe, it, expect } from 'vitest';
import { CONDUIT_MIN_FRAME, evaluateConduit, type ConduitLookup } from './conduit_activate';

const airLookup = (water = true): ConduitLookup => ({
  isWater: () => water,
  blockAt: () => 'webmc:air',
});

describe('conduit', () => {
  it('inactive without water', () => {
    const s = evaluateConduit({
      pos: { x: 0, y: 60, z: 0 },
      lookup: airLookup(false),
    });
    expect(s.active).toBe(false);
  });

  it('inactive without enough frame blocks', () => {
    const s = evaluateConduit({ pos: { x: 0, y: 60, z: 0 }, lookup: airLookup() });
    expect(s.active).toBe(false);
  });

  it('activates when frame threshold met', () => {
    const l: ConduitLookup = {
      isWater: () => true,
      blockAt: () => 'webmc:prismarine',
    };
    const s = evaluateConduit({ pos: { x: 0, y: 60, z: 0 }, lookup: l });
    expect(s.active).toBe(true);
    expect(s.frameBlockCount).toBeGreaterThanOrEqual(CONDUIT_MIN_FRAME);
    expect(s.powerRadius).toBeGreaterThan(0);
  });

  it('full 42-block frame enables attack', () => {
    const l: ConduitLookup = {
      isWater: () => true,
      blockAt: () => 'webmc:sea_lantern',
    };
    const s = evaluateConduit({ pos: { x: 0, y: 60, z: 0 }, lookup: l });
    expect(s.attackHostiles).toBe(true);
  });
});
