import { describe, it, expect } from 'vitest';
import { facingFrom, formatPos, chunkCoords, summary } from './debug_hud_info';

describe('debug hud info', () => {
  it('yaw 0 south', () => {
    expect(facingFrom(0)).toBe('south');
  });

  it('yaw 90 west', () => {
    expect(facingFrom(90)).toBe('west');
  });

  it('yaw 180 north', () => {
    expect(facingFrom(180)).toBe('north');
  });

  it('yaw 270 east', () => {
    expect(facingFrom(270)).toBe('east');
  });

  it('formatPos precision', () => {
    expect(formatPos({ x: 1, y: 2, z: 3 })).toContain('1.000');
  });

  it('chunk coords floor', () => {
    expect(chunkCoords(17, -1)).toEqual({ cx: 1, cz: -1 });
  });

  it('summary includes FPS', () => {
    const s = summary({
      pos: { x: 0, y: 0, z: 0 },
      facing: 'south',
      biome: 'plains',
      lightBlock: 0,
      lightSky: 15,
      fps: 60,
      chunkX: 0,
      chunkZ: 0,
      loadedChunks: 100,
    });
    expect(s).toContain('60 FPS');
  });
});
