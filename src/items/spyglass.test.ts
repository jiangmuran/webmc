import { describe, it, expect } from 'vitest';
import { makeSpyglass, releaseSpyglass, useSpyglass } from './spyglass';

describe('spyglass', () => {
  it('starts at default FOV', () => {
    expect(makeSpyglass().fovMultiplier).toBe(1);
  });

  it('use drops FOV to 10x zoom', () => {
    const s = makeSpyglass();
    useSpyglass(s);
    expect(s.active).toBe(true);
    expect(s.fovMultiplier).toBe(0.1);
  });

  it('release restores FOV', () => {
    const s = makeSpyglass();
    useSpyglass(s);
    releaseSpyglass(s);
    expect(s.active).toBe(false);
    expect(s.fovMultiplier).toBe(1);
  });
});
