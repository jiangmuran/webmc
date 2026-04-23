import { describe, it, expect } from 'vitest';
import { linesFor, hasGraph } from './debug_overlay_f3';

describe('debug overlay F3', () => {
  const ctx = {
    fps: 60,
    chunk: { x: 1, z: 2 },
    biome: 'plains',
    blockPos: { x: 10, y: 64, z: 5 },
    direction: 'N',
    lightLevel: 15,
  };

  it('lines include fps', () => {
    expect(linesFor(ctx).some((l) => l.includes('60'))).toBe(true);
  });

  it('shows biome', () => {
    expect(linesFor(ctx).some((l) => l.includes('plains'))).toBe(true);
  });

  it('graph enabled', () => {
    expect(hasGraph()).toBe(true);
  });
});
