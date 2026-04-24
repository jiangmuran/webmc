import { describe, it, expect } from 'vitest';
import { skyColorForTick, starBrightness } from './skybox_color_phase';

describe('skybox color phase', () => {
  it('noon bright', () => {
    const c = skyColorForTick(6000);
    expect(c.b).toBeGreaterThan(0.5);
  });

  it('midnight dark', () => {
    const c = skyColorForTick(18000);
    expect(c.r).toBeLessThan(skyColorForTick(6000).r);
  });

  it('stars invisible at noon', () => {
    expect(starBrightness(6000)).toBe(0);
  });

  it('stars brightest near midnight', () => {
    const mid = starBrightness(17650);
    const edge = starBrightness(13000);
    expect(mid).toBeGreaterThan(edge);
  });

  it('stars invisible at dawn', () => {
    expect(starBrightness(23500)).toBe(0);
  });
});
