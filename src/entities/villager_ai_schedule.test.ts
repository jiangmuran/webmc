import { describe, it, expect } from 'vitest';
import { activityAt, overrideForPanic } from './villager_ai_schedule';

describe('villager AI schedule', () => {
  it('adults work morning', () => {
    expect(activityAt(5000, false)).toBe('work');
  });

  it('adults meet around noon', () => {
    expect(activityAt(10000, false)).toBe('meet');
  });

  it('adults rest at night', () => {
    expect(activityAt(13000, false)).toBe('rest');
  });

  it('children play', () => {
    expect(activityAt(5000, true)).toBe('play');
  });

  it('children meet late', () => {
    expect(activityAt(10500, true)).toBe('meet');
  });

  it('panic overrides', () => {
    expect(overrideForPanic(true)).toBe('panic');
  });

  it('no threat no override', () => {
    expect(overrideForPanic(false)).toBeUndefined();
  });
});
