import { describe, it, expect } from 'vitest';
import { isDaytime, shouldSleep } from './fox_sleep';

describe('fox sleep', () => {
  it('noon is day', () => {
    expect(isDaytime(6000)).toBe(true);
  });

  it('midnight is night', () => {
    expect(isDaytime(18000)).toBe(false);
  });

  it('nocturnal sleeps in day under shelter', () => {
    expect(shouldSleep({ isNocturnal: true, timeOfDayTicks: 6000, hasShelterAbove: true })).toBe(
      true,
    );
  });

  it('nocturnal without shelter does not sleep', () => {
    expect(shouldSleep({ isNocturnal: true, timeOfDayTicks: 6000, hasShelterAbove: false })).toBe(
      false,
    );
  });

  it('diurnal sleeps at night', () => {
    expect(shouldSleep({ isNocturnal: false, timeOfDayTicks: 18000, hasShelterAbove: false })).toBe(
      true,
    );
  });

  it('day wraps modulo', () => {
    expect(isDaytime(6000 + 24000 * 3)).toBe(true);
  });
});
