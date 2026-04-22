import { describe, it, expect } from 'vitest';
import { addLayer, clearLayers, layerCount, makeBanner, washOneLayer } from './banner';

describe('banner', () => {
  it('starts empty with a base color', () => {
    const b = makeBanner('red');
    expect(b.baseColor).toBe('red');
    expect(layerCount(b)).toBe(0);
  });

  it('addLayer respects 6-layer cap', () => {
    const b = makeBanner('black');
    for (let i = 0; i < 6; i++) {
      expect(addLayer(b, { pattern: 'stripe_top', color: 'white' })).toBe(true);
    }
    expect(addLayer(b, { pattern: 'creeper', color: 'green' })).toBe(false);
    expect(layerCount(b)).toBe(6);
  });

  it('washOneLayer pops top layer', () => {
    const b = makeBanner();
    addLayer(b, { pattern: 'stripe_top', color: 'red' });
    addLayer(b, { pattern: 'creeper', color: 'green' });
    expect(washOneLayer(b)).toBe(true);
    expect(layerCount(b)).toBe(1);
    expect(b.layers[0]?.pattern).toBe('stripe_top');
  });

  it('washOneLayer on empty returns false', () => {
    const b = makeBanner();
    expect(washOneLayer(b)).toBe(false);
  });

  it('clearLayers wipes all layers', () => {
    const b = makeBanner();
    addLayer(b, { pattern: 'creeper', color: 'green' });
    addLayer(b, { pattern: 'skull', color: 'white' });
    clearLayers(b);
    expect(layerCount(b)).toBe(0);
  });
});
