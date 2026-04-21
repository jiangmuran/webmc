import { describe, it, expect } from 'vitest';
import { DayNightCycle } from './DayNightCycle';

describe('DayNightCycle', () => {
  it('defaults to mid-morning (day)', () => {
    const d = new DayNightCycle();
    expect(d.timeOfDay).toBeGreaterThanOrEqual(0);
    expect(d.timeOfDay).toBeLessThan(1);
    expect(d.isDay).toBe(true);
  });

  it('ticks forward and wraps at 1', () => {
    const d = new DayNightCycle({ dayLengthSec: 100, startTimeOfDay: 0.9 });
    d.tick(15);
    expect(d.timeOfDay).toBeCloseTo(0.05, 3);
  });

  it('sun dips below horizon around timeOfDay 0.75', () => {
    const d = new DayNightCycle({ startTimeOfDay: 0.75 });
    expect(d.isDay).toBe(false);
  });

  it('sky color is dark at night, bright at noon', () => {
    const day = new DayNightCycle({ startTimeOfDay: 0.25 });
    const night = new DayNightCycle({ startTimeOfDay: 0.75 });
    expect(day.skyColor.r + day.skyColor.g + day.skyColor.b).toBeGreaterThan(
      night.skyColor.r + night.skyColor.g + night.skyColor.b,
    );
  });

  it('tick is smooth: no single step jumps ambient by more than 0.1', () => {
    const d = new DayNightCycle({ dayLengthSec: 60, startTimeOfDay: 0 });
    let lastAmbient = d.ambient;
    for (let i = 0; i < 60; i++) {
      d.tick(1);
      expect(Math.abs(d.ambient - lastAmbient)).toBeLessThan(0.15);
      lastAmbient = d.ambient;
    }
  });
});
