import { describe, it, expect } from 'vitest';
import { mixSound, panSound } from './sound_falloff';

describe('sound falloff', () => {
  it('near source = full volume', () => {
    const m = mixSound({
      sourcePos: { x: 0, y: 0, z: 0 },
      listenerPos: { x: 1, y: 0, z: 0 },
      maxRangeBlocks: 32,
      isOccluded: false,
      baseVolume: 1,
    });
    expect(m.volume).toBeGreaterThan(0.9);
  });

  it('far source = 0', () => {
    const m = mixSound({
      sourcePos: { x: 100, y: 0, z: 0 },
      listenerPos: { x: 0, y: 0, z: 0 },
      maxRangeBlocks: 32,
      isOccluded: false,
      baseVolume: 1,
    });
    expect(m.volume).toBe(0);
  });

  it('occluded sound attenuated', () => {
    const clear = mixSound({
      sourcePos: { x: 10, y: 0, z: 0 },
      listenerPos: { x: 0, y: 0, z: 0 },
      maxRangeBlocks: 32,
      isOccluded: false,
      baseVolume: 1,
    });
    const muffled = mixSound({
      sourcePos: { x: 10, y: 0, z: 0 },
      listenerPos: { x: 0, y: 0, z: 0 },
      maxRangeBlocks: 32,
      isOccluded: true,
      baseVolume: 1,
    });
    expect(muffled.volume).toBeLessThan(clear.volume);
  });

  it('panning right for source on right', () => {
    const p = panSound(
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: -1 }, // facing -z
      { x: 10, y: 0, z: 0 }, // source to the right
    );
    expect(p).toBeGreaterThan(0);
  });
});
