import { describe, it, expect } from 'vitest';
import { projectToMinimap } from './minimap';

describe('minimap projection', () => {
  it('self position projects to center', () => {
    const p = projectToMinimap(
      {
        playerPos: { x: 100, y: 64, z: 100 },
        playerYaw: 0,
        radiusBlocks: 32,
        pixelRadius: 64,
      },
      { x: 100, z: 100 },
    );
    expect(Math.abs(p.px)).toBeLessThan(0.01);
    expect(Math.abs(p.py)).toBeLessThan(0.01);
  });

  it('far entity outside circle', () => {
    const p = projectToMinimap(
      {
        playerPos: { x: 0, y: 0, z: 0 },
        playerYaw: 0,
        radiusBlocks: 32,
        pixelRadius: 64,
      },
      { x: 100, z: 0 },
    );
    expect(p.insideCircle).toBe(false);
  });

  it('close entity inside circle', () => {
    const p = projectToMinimap(
      {
        playerPos: { x: 0, y: 0, z: 0 },
        playerYaw: 0,
        radiusBlocks: 32,
        pixelRadius: 64,
      },
      { x: 10, z: 0 },
    );
    expect(p.insideCircle).toBe(true);
  });
});
