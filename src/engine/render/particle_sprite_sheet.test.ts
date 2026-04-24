import { describe, it, expect } from 'vitest';
import { frameIndexFor, uvForFrame, type ParticleAnimation } from './particle_sprite_sheet';

const anim: ParticleAnimation = { frames: 8, frameDurationTicks: 2, loops: true };

describe('particle sprite sheet', () => {
  it('first tick frame 0', () => {
    expect(frameIndexFor(anim, 0)).toBe(0);
  });

  it('third tick frame 1', () => {
    expect(frameIndexFor(anim, 3)).toBe(1);
  });

  it('loops around', () => {
    expect(frameIndexFor(anim, 8 * 2)).toBe(0);
  });

  it('non-looping stops at last', () => {
    const single: ParticleAnimation = { ...anim, loops: false };
    expect(frameIndexFor(single, 999)).toBe(anim.frames - 1);
  });

  it('UV bounded', () => {
    const uv = uvForFrame(0, 16, 128);
    expect(uv.u).toBe(0);
    expect(uv.size).toBe(16 / 128);
  });

  it('UV advances', () => {
    expect(uvForFrame(1, 16, 128).u).toBeGreaterThan(0);
  });
});
