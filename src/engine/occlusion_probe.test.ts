import { describe, it, expect } from 'vitest';
import { makeFullConnectivity, setConnected, connected, invertedFace } from './occlusion_probe';

describe('occlusion probe', () => {
  it('full connectivity default', () => {
    const c = makeFullConnectivity();
    expect(connected(c, 0, 1)).toBe(true);
    expect(connected(c, 2, 3)).toBe(true);
  });

  it('set disconnect symmetric', () => {
    const c = makeFullConnectivity();
    setConnected(c, 0, 1, false);
    expect(connected(c, 0, 1)).toBe(false);
    expect(connected(c, 1, 0)).toBe(false);
  });

  it('invert face pairs', () => {
    expect(invertedFace(0)).toBe(1);
    expect(invertedFace(2)).toBe(3);
    expect(invertedFace(5)).toBe(4);
  });
});
