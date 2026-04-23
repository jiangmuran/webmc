import { describe, it, expect } from 'vitest';
import { nextRadius } from './view_distance_adaptive';

describe('adaptive view distance', () => {
  it('drops when slow', () => {
    expect(
      nextRadius({
        currentRadius: 12,
        p95FrameMs: 60,
        targetFrameMs: 16,
        minRadius: 4,
        maxRadius: 16,
      }),
    ).toBe(11);
  });

  it('rises when fast', () => {
    expect(
      nextRadius({
        currentRadius: 8,
        p95FrameMs: 6,
        targetFrameMs: 16,
        minRadius: 4,
        maxRadius: 16,
      }),
    ).toBe(9);
  });

  it('holds in band', () => {
    expect(
      nextRadius({
        currentRadius: 8,
        p95FrameMs: 16,
        targetFrameMs: 16,
        minRadius: 4,
        maxRadius: 16,
      }),
    ).toBe(8);
  });

  it('clamps to min', () => {
    expect(
      nextRadius({
        currentRadius: 4,
        p95FrameMs: 200,
        targetFrameMs: 16,
        minRadius: 4,
        maxRadius: 16,
      }),
    ).toBe(4);
  });

  it('clamps to max', () => {
    expect(
      nextRadius({
        currentRadius: 16,
        p95FrameMs: 2,
        targetFrameMs: 16,
        minRadius: 4,
        maxRadius: 16,
      }),
    ).toBe(16);
  });
});
