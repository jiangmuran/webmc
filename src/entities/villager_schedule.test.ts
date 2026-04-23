import { describe, it, expect } from 'vitest';
import { activityAt, shouldSeekBedNow } from './villager_schedule';

describe('villager schedule', () => {
  it('morning rise', () => {
    expect(activityAt(1000, false)).toBe('rise');
  });

  it('midday work', () => {
    expect(activityAt(6000, false)).toBe('work');
  });

  it('evening socialize', () => {
    expect(activityAt(10000, false)).toBe('socialize');
  });

  it('night sleep', () => {
    expect(activityAt(14000, false)).toBe('sleep');
  });

  it('baby villager sleep at night', () => {
    expect(activityAt(15000, true)).toBe('sleep');
  });

  it('shouldSeekBed', () => {
    expect(shouldSeekBedNow('sleep')).toBe(true);
    expect(shouldSeekBedNow('work')).toBe(false);
  });
});
