import { describe, it, expect } from 'vitest';
import { bucketForDistance, tickInterval, shouldTick } from './tick_priority_bucket';

describe('tick priority bucket', () => {
  it('near bucket', () => {
    expect(bucketForDistance(10)).toBe('near');
  });

  it('frozen beyond far', () => {
    expect(bucketForDistance(1000)).toBe('frozen');
  });

  it('tick interval scales', () => {
    expect(tickInterval('near')).toBeLessThan(tickInterval('mid'));
    expect(tickInterval('mid')).toBeLessThan(tickInterval('far'));
  });

  it('frozen never ticks', () => {
    expect(shouldTick('frozen', 0)).toBe(false);
  });

  it('near ticks every frame', () => {
    expect(shouldTick('near', 7)).toBe(true);
  });

  it('far ticks every 4', () => {
    expect(shouldTick('far', 4)).toBe(true);
    expect(shouldTick('far', 5)).toBe(false);
  });
});
