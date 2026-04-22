import { describe, it, expect } from 'vitest';
import {
  cardinalFromYaw,
  debugCoordsFor,
  formatBlock,
  formatChunk,
  formatXYZ,
} from './coordinate_display';

describe('coordinate display', () => {
  it('cardinal N at yaw ≈ π', () => {
    expect(cardinalFromYaw(Math.PI)).toBe('N');
  });

  it('cardinal S at yaw 0', () => {
    expect(cardinalFromYaw(0)).toBe('S');
  });

  it('debugCoords computes chunk pos', () => {
    const c = debugCoordsFor({ x: 20, y: 70, z: -5 }, 0);
    expect(c.chunkPos.cx).toBe(1);
    expect(c.chunkPos.cz).toBe(-1);
  });

  it('formatXYZ', () => {
    expect(formatXYZ({ x: 10.5, y: 64, z: -20.25 })).toBe('XYZ: 10.5 / 64 / -20.3');
  });

  it('formatBlock', () => {
    expect(formatBlock({ x: 10.5, y: 64.1, z: -20.9 })).toBe('Block: 10 64 -21');
  });

  it('formatChunk', () => {
    expect(formatChunk({ x: 20, y: 70, z: -5 })).toBe('Chunk: 1 4 -1');
  });
});
