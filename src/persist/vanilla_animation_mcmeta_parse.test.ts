import { describe, it, expect } from 'vitest';
import {
  parseVanillaAnimationMcmeta,
  frameDurations,
  totalAnimationTicks,
  AnimationMcmetaParseError,
} from './vanilla_animation_mcmeta_parse';

describe('vanilla animation .mcmeta parser', () => {
  it('parses a typical water animation', () => {
    const a = parseVanillaAnimationMcmeta(
      JSON.stringify({
        animation: {
          frametime: 2,
          interpolate: true,
          frames: [0, 1, 2, 3, { index: 4, time: 4 }],
        },
      }),
    );
    expect(a.frametime).toBe(2);
    expect(a.interpolate).toBe(true);
    expect(a.width).toBeNull();
    expect(a.height).toBeNull();
    expect(a.frames.length).toBe(5);
    expect(a.frames[0]).toEqual({ index: 0, time: 0 });
    expect(a.frames[4]).toEqual({ index: 4, time: 4 });
  });

  it('reads sub-frame width / height', () => {
    const a = parseVanillaAnimationMcmeta(
      JSON.stringify({ animation: { width: 16, height: 16, frames: [] } }),
    );
    expect(a.width).toBe(16);
    expect(a.height).toBe(16);
  });

  it('frameDurations picks per-frame overrides over default', () => {
    const a = parseVanillaAnimationMcmeta(
      JSON.stringify({
        animation: {
          frametime: 5,
          frames: [0, { index: 1, time: 10 }, 2],
        },
      }),
    );
    expect(frameDurations(a)).toEqual([5, 10, 5]);
    expect(totalAnimationTicks(a)).toBe(20);
  });

  it('throws on missing animation field', () => {
    expect(() => parseVanillaAnimationMcmeta('{}')).toThrow(AnimationMcmetaParseError);
  });

  it('throws on invalid JSON', () => {
    expect(() => parseVanillaAnimationMcmeta('not json')).toThrow(AnimationMcmetaParseError);
  });
});
