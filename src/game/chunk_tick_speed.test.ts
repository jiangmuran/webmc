import { describe, it, expect, vi } from 'vitest';
import {
  DEFAULT_RANDOM_TICK_SPEED,
  dispatchRandomTick,
  eventsPerSecondPerChunk,
  registerRandomTick,
  rollRandomTicks,
} from './chunk_tick_speed';

describe('random tick speed', () => {
  it('default is 3', () => {
    expect(DEFAULT_RANDOM_TICK_SPEED).toBe(3);
  });

  it('rolls N coordinates', () => {
    const coords = rollRandomTicks({ subChunkSize: 16, tickSpeed: 3, rng: () => 0 });
    expect(coords.length).toBe(3);
  });

  it('coords are within subchunk', () => {
    const coords = rollRandomTicks({ subChunkSize: 16, tickSpeed: 50, rng: () => Math.random() });
    for (const c of coords) {
      expect(c.x).toBeGreaterThanOrEqual(0);
      expect(c.x).toBeLessThan(16);
    }
  });

  it('zero tickSpeed = empty', () => {
    expect(rollRandomTicks({ subChunkSize: 16, tickSpeed: 0, rng: () => 0 }).length).toBe(0);
  });

  it('events/sec scales with tickSpeed', () => {
    expect(eventsPerSecondPerChunk(3)).toBeGreaterThan(eventsPerSecondPerChunk(1));
  });

  it('registerRandomTick + dispatch', () => {
    const handler = vi.fn();
    registerRandomTick('webmc:test', handler);
    const ok = dispatchRandomTick('webmc:test', { x: 0, y: 0, z: 0 });
    expect(ok).toBe(true);
    expect(handler).toHaveBeenCalled();
  });

  it('unknown block returns false', () => {
    expect(dispatchRandomTick('webmc:unknown', { x: 0, y: 0, z: 0 })).toBe(false);
  });
});
