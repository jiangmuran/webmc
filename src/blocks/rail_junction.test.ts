import { describe, it, expect } from 'vitest';
import { autoShape, isCurve } from './rail_junction';

describe('rail junction', () => {
  it('isolated east-west default', () => {
    expect(autoShape({ north: false, south: false, east: false, west: false })).toBe('east_west');
  });

  it('both N-S straight', () => {
    expect(autoShape({ north: true, south: true, east: false, west: false })).toBe('north_south');
  });

  it('NE curve', () => {
    expect(autoShape({ north: true, south: false, east: true, west: false })).toBe('north_east');
  });

  it('SW curve', () => {
    expect(autoShape({ north: false, south: true, east: false, west: true })).toBe('south_west');
  });

  it('isCurve filter', () => {
    expect(isCurve('north_east')).toBe(true);
    expect(isCurve('north_south')).toBe(false);
  });
});
