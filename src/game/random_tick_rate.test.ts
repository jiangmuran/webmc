import { describe, it, expect } from 'vitest';
import {
  randomTicksPerSubchunkPerTick,
  blocksTickedPerChunkPerTick,
  totalTicksPerSecond,
  DEFAULT_RANDOM_TICK_SPEED,
} from './random_tick_rate';

describe('random tick rate', () => {
  it('default 3', () => {
    expect(DEFAULT_RANDOM_TICK_SPEED).toBe(3);
  });

  it('floors negative', () => {
    expect(randomTicksPerSubchunkPerTick(-5)).toBe(0);
  });

  it('scales with subchunks', () => {
    expect(blocksTickedPerChunkPerTick(3, 24)).toBe(72);
  });

  it('per-second 20x', () => {
    expect(totalTicksPerSecond(3, 24)).toBe(72 * 20);
  });
});
