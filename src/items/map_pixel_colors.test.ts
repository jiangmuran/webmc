import { describe, it, expect } from 'vitest';
import { shadeFor, colorForBlock } from './map_pixel_colors';

describe('map pixel colors', () => {
  it('grass is green-ish', () => {
    const c = colorForBlock('grass');
    expect(c[1]).toBeGreaterThan(c[0]);
  });

  it('unknown block falls to stone', () => {
    expect(colorForBlock('xyz')).toEqual(colorForBlock('stone'));
  });

  it('brightest shade is brighter than dimmest', () => {
    const base = colorForBlock('stone');
    expect(shadeFor(2, base)[0]).toBeGreaterThan(shadeFor(3, base)[0]);
  });
});
