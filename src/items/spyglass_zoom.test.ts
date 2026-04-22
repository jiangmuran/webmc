import { describe, it, expect } from 'vitest';
import { makeSpyglass, raise, lower, tickFov, blocksSprint, ZOOM_FOV } from './spyglass_zoom';

describe('spyglass', () => {
  it('raise sets savedFov', () => {
    const s = makeSpyglass(70);
    raise(s, 80);
    expect(s.raised).toBe(true);
    expect(s.savedFov).toBe(80);
  });

  it('fov approaches zoom', () => {
    const s = makeSpyglass(70);
    raise(s, 70);
    for (let i = 0; i < 200; i++) tickFov(s);
    expect(Math.abs(s.currentFov - ZOOM_FOV)).toBeLessThan(0.01);
  });

  it('lower restores', () => {
    const s = makeSpyglass(70);
    raise(s, 70);
    lower(s);
    for (let i = 0; i < 200; i++) tickFov(s);
    expect(Math.abs(s.currentFov - 70)).toBeLessThan(0.01);
  });

  it('blocks sprint when raised', () => {
    const s = makeSpyglass(70);
    expect(blocksSprint(s)).toBe(false);
    raise(s, 70);
    expect(blocksSprint(s)).toBe(true);
  });
});
