import { describe, it, expect } from 'vitest';
import { pickLanding, defaultSearchRadius } from './boat_dismount_spot';

describe('boat dismount spot', () => {
  it('no safe → null', () => {
    expect(pickLanding([{ x: 0, y: 0, z: 0, safe: false, onShore: true }])).toBeNull();
  });

  it('prefers shore over water', () => {
    const r = pickLanding([
      { x: 1, y: 0, z: 0, safe: true, onShore: false },
      { x: 2, y: 0, z: 0, safe: true, onShore: true },
    ]);
    expect(r?.x).toBe(2);
  });

  it('falls back to any safe', () => {
    expect(pickLanding([{ x: 5, y: 0, z: 0, safe: true, onShore: false }])?.x).toBe(5);
  });

  it('search radius 2', () => {
    expect(defaultSearchRadius()).toBe(2);
  });
});
