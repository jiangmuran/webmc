import { describe, it, expect } from 'vitest';
import { renderScaleFor, framebufferSize, adjustForFrameTime } from './screen_dpi_scale';

describe('screen dpi scale', () => {
  it('low tier caps at 1', () => {
    expect(renderScaleFor({ dpr: 3, gpuTier: 'low' })).toBe(1);
  });

  it('high tier caps at 2', () => {
    expect(renderScaleFor({ dpr: 4, gpuTier: 'high' })).toBe(2);
  });

  it('mid tier caps at 1.5', () => {
    expect(renderScaleFor({ dpr: 3, gpuTier: 'mid' })).toBe(1.5);
  });

  it('framebuffer size rounds', () => {
    expect(framebufferSize(100, 100, 0.75)).toEqual({ w: 75, h: 75 });
  });

  it('adjust down when over budget', () => {
    expect(adjustForFrameTime(1.5, 30, 16.7)).toBeLessThan(1.5);
  });

  it('adjust up when under budget', () => {
    expect(adjustForFrameTime(1, 8, 16.7)).toBeGreaterThan(1);
  });

  it('stable when in budget', () => {
    expect(adjustForFrameTime(1, 16, 16.7)).toBe(1);
  });
});
