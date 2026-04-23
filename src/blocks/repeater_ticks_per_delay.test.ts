import { describe, it, expect } from 'vitest';
import { delayTicks, cycleNextDelay, MIN_DELAY, MAX_DELAY } from './repeater_ticks_per_delay';

describe('repeater ticks per delay', () => {
  it('setting 1 = 2 ticks', () => {
    expect(delayTicks(1)).toBe(2);
  });

  it('setting 4 = 8 ticks', () => {
    expect(delayTicks(4)).toBe(8);
  });

  it('setting 5 clamps', () => {
    expect(delayTicks(5)).toBe(8);
  });

  it('cycle 4 -> 1', () => {
    expect(cycleNextDelay(MAX_DELAY)).toBe(MIN_DELAY);
  });

  it('cycle 1 -> 2', () => {
    expect(cycleNextDelay(1)).toBe(2);
  });
});
