import { describe, it, expect } from 'vitest';
import { makeDebugOverlay, handleKey, formatLine1, formatLine2 } from './debug_overlay';

describe('debug overlay', () => {
  it('F3 toggles', () => {
    const s = makeDebugOverlay();
    handleKey(s, 'F3');
    expect(s.open).toBe(true);
    handleKey(s, 'F3');
    expect(s.open).toBe(false);
  });

  it('G and B toggle sub-flags', () => {
    const s = makeDebugOverlay();
    handleKey(s, 'F3+G');
    expect(s.showChunkBorders).toBe(true);
    handleKey(s, 'F3+B');
    expect(s.showHitboxes).toBe(true);
  });

  it('esc closes', () => {
    const s = makeDebugOverlay();
    handleKey(s, 'F3');
    handleKey(s, 'esc');
    expect(s.open).toBe(false);
  });

  it('format lines', () => {
    const l1 = formatLine1({
      fps: 60,
      x: 1.5,
      y: 64,
      z: -2.25,
      facing: 'E',
      biome: 'plains',
      chunkLoaded: 121,
    });
    expect(l1).toContain('fps=60');
    expect(l1).toContain('facing=E');
    const l2 = formatLine2({
      fps: 60,
      x: 0,
      y: 0,
      z: 0,
      facing: 'N',
      biome: 'plains',
      chunkLoaded: 100,
    });
    expect(l2).toBe('biome=plains chunks=100');
  });
});
