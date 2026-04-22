import { describe, it, expect } from 'vitest';
import { CLOCK_FRAMES, clockFrame, isFullMoon, moonPhase } from './clock_item';

describe('clock item', () => {
  it('64 frames', () => {
    expect(CLOCK_FRAMES).toBe(64);
  });

  it('noon picks mid-dial frame', () => {
    expect(clockFrame({ dimension: 'overworld', normalizedTime: 0.25 })).toBe(16);
  });

  it('dawn is frame 0', () => {
    expect(clockFrame({ dimension: 'overworld', normalizedTime: 0 })).toBe(0);
  });

  it('nether spins randomly', () => {
    const f = clockFrame({ dimension: 'nether', normalizedTime: 0.25 });
    expect(f).toBeGreaterThanOrEqual(0);
    expect(f).toBeLessThan(CLOCK_FRAMES);
  });
});

describe('moon phase', () => {
  it('phase 0..7', () => {
    for (let d = 0; d < 16; d++) {
      const p = moonPhase(d);
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThan(8);
    }
  });

  it('day 0 is full moon', () => {
    expect(isFullMoon(0)).toBe(true);
  });

  it('day 8 is full moon again', () => {
    expect(isFullMoon(8)).toBe(true);
  });
});
