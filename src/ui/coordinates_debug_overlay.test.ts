import { describe, it, expect } from 'vitest';
import { formatDebug, yawToFacing, type DebugInfo } from './coordinates_debug_overlay';

const info: DebugInfo = {
  x: 10.5,
  y: 64,
  z: -20.5,
  chunkX: 0,
  chunkZ: -2,
  facing: 'north',
  biome: 'plains',
  lightLevel: 15,
  fps: 60,
  memoryMB: 512,
};

describe('coordinates debug overlay', () => {
  it('includes XYZ line', () => {
    expect(formatDebug(info).some((l) => l.startsWith('XYZ'))).toBe(true);
  });

  it('includes FPS', () => {
    expect(formatDebug(info).some((l) => l.includes('FPS'))).toBe(true);
  });

  it('yaw 0 faces south', () => {
    expect(yawToFacing(0)).toBe('south');
  });

  it('yaw pi/2 faces west', () => {
    expect(yawToFacing(Math.PI / 2)).toBe('west');
  });

  it('yaw pi faces north', () => {
    expect(yawToFacing(Math.PI)).toBe('north');
  });

  it('normalizes negative yaw', () => {
    expect(yawToFacing(-2 * Math.PI)).toBe('south');
  });
});
