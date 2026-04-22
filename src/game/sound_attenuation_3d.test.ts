import { describe, it, expect } from 'vitest';
import { attenuate, occludeVolume } from './sound_attenuation_3d';

const emit = { sourceX: 5, sourceY: 0, sourceZ: 0, baseVolume: 1, maxDistance: 10 };
const listener = { listenerX: 0, listenerY: 0, listenerZ: 0, forwardX: 0, forwardZ: 1 };

describe('sound attenuation', () => {
  it('closer louder', () => {
    const close = attenuate(emit, listener);
    const far = attenuate({ ...emit, sourceX: 9 }, listener);
    expect(close.volume).toBeGreaterThan(far.volume);
  });

  it('past range silent', () => {
    expect(attenuate({ ...emit, sourceX: 100 }, listener).volume).toBe(0);
  });

  it('pan right (source +X, listener looking +Z)', () => {
    const m = attenuate(emit, listener);
    expect(m.panLR).toBeGreaterThan(0);
  });

  it('pan left', () => {
    const m = attenuate({ ...emit, sourceX: -5 }, listener);
    expect(m.panLR).toBeLessThan(0);
  });

  it('occlusion halves', () => {
    expect(occludeVolume(1, 1)).toBe(0.5);
    expect(occludeVolume(1, 3)).toBeCloseTo(0.125);
  });
});
