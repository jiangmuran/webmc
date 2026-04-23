import { describe, it, expect } from 'vitest';
import { stainedGlassFor, beamColor } from './beacon_beam_color';

describe('beacon beam color', () => {
  it('extracts stained color', () => {
    expect(stainedGlassFor('red_stained_glass')).toBe('red');
  });

  it('pane also works', () => {
    expect(stainedGlassFor('blue_stained_glass_pane')).toBe('blue');
  });

  it('non-glass undefined', () => {
    expect(stainedGlassFor('stone')).toBeUndefined();
  });

  it('no glass → white', () => {
    expect(beamColor([])).toEqual([255, 255, 255]);
  });

  it('red glass → reddish', () => {
    const [r, g, b] = beamColor(['red_stained_glass']);
    expect(r).toBeGreaterThan(g);
    expect(r).toBeGreaterThan(b);
  });

  it('mixes two', () => {
    const [r, g] = beamColor(['red_stained_glass', 'green_stained_glass']);
    expect(r).toBeGreaterThan(0);
    expect(g).toBeGreaterThan(0);
  });
});
