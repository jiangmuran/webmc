import { describe, it, expect } from 'vitest';
import {
  shouldTrigger,
  setFilterFromInput,
  emittedSignal,
  MAX_FREQUENCY,
} from './calibrated_sculk_sensor';

describe('calibrated sculk sensor', () => {
  it('no filter passes all', () => {
    expect(shouldTrigger({ filterFrequency: 0 }, 5)).toBe(true);
  });

  it('filter matches exact freq', () => {
    expect(shouldTrigger({ filterFrequency: 7 }, 7)).toBe(true);
    expect(shouldTrigger({ filterFrequency: 7 }, 6)).toBe(false);
  });

  it('set filter from input', () => {
    expect(setFilterFromInput(5).filterFrequency).toBe(5);
  });

  it('clamps input', () => {
    expect(setFilterFromInput(20).filterFrequency).toBe(MAX_FREQUENCY);
    expect(setFilterFromInput(-3).filterFrequency).toBe(0);
  });

  it('emits signal strength = freq', () => {
    expect(emittedSignal(9)).toBe(9);
    expect(emittedSignal(100)).toBe(15);
  });
});
