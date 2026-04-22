import { describe, it, expect } from 'vitest';
import { Heightmap } from './heightmap';

describe('heightmap', () => {
  it('unset column returns -1', () => {
    expect(new Heightmap().get(0, 0)).toBe(-1);
  });

  it('place updates height only when higher', () => {
    const h = new Heightmap();
    h.updateOnPlace(0, 64, 0);
    h.updateOnPlace(0, 60, 0);
    expect(h.get(0, 0)).toBe(64);
  });

  it("break below top doesn't shift", () => {
    const h = new Heightmap();
    h.set(0, 0, 64);
    h.updateOnBreak(0, 50, 0, () => true);
    expect(h.get(0, 0)).toBe(64);
  });

  it('break top walks down to next solid', () => {
    const h = new Heightmap();
    h.set(0, 0, 64);
    h.updateOnBreak(0, 64, 0, (y) => y <= 60);
    expect(h.get(0, 0)).toBe(60);
  });

  it('fully-broken column returns -1', () => {
    const h = new Heightmap();
    h.set(0, 0, 64);
    h.updateOnBreak(0, 64, 0, () => false);
    expect(h.get(0, 0)).toBe(-1);
  });
});
