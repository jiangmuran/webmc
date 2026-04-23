import { describe, it, expect } from 'vitest';
import { streamingOrder, lodLevelForDistance, downsampleFactor } from './chunk_lod_stream';

describe('chunk LOD stream', () => {
  it('closest first', () => {
    const r = streamingOrder(
      [
        { cx: 10, cz: 10, distance: 10 },
        { cx: 0, cz: 0, distance: 0 },
        { cx: 5, cz: 5, distance: 5 },
      ],
      3,
    );
    expect(r[0]?.distance).toBe(0);
  });

  it('caps at max', () => {
    const reqs = Array.from({ length: 20 }, (_, i) => ({ cx: i, cz: 0, distance: i }));
    expect(streamingOrder(reqs, 5)).toHaveLength(5);
  });

  it('near → full LOD', () => {
    expect(lodLevelForDistance(2)).toBe('full');
  });

  it('far → skip', () => {
    expect(lodLevelForDistance(100)).toBe('skip');
  });

  it('skip factor 0', () => {
    expect(downsampleFactor('skip')).toBe(0);
  });

  it('half factor 2', () => {
    expect(downsampleFactor('half')).toBe(2);
  });
});
