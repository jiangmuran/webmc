import { describe, it, expect } from 'vitest';
import { makeSnowLayer, tickSnowLayer } from './snow_layer';

describe('snow layer', () => {
  it('clamps layers 1..8 on creation', () => {
    expect(makeSnowLayer(20).layers).toBe(8);
    expect(makeSnowLayer(0).layers).toBe(1);
  });

  it('accumulates in cold biome during snow', () => {
    const s = makeSnowLayer(1);
    const r = tickSnowLayer(
      s,
      { isSnowing: true, lightLevel: 0, surfaceTemperature: 0, dtSec: 100 },
      () => 0,
    );
    expect(r.changed).toBe(true);
    expect(s.layers).toBe(2);
  });

  it('melts in bright light', () => {
    const s = makeSnowLayer(4);
    const r = tickSnowLayer(
      s,
      { isSnowing: false, lightLevel: 13, surfaceTemperature: 0, dtSec: 100 },
      () => 0,
    );
    expect(r.changed).toBe(true);
    expect(s.layers).toBe(3);
  });

  it('melts fully past layer 0', () => {
    const s = makeSnowLayer(1);
    tickSnowLayer(
      s,
      { isSnowing: false, lightLevel: 15, surfaceTemperature: 1, dtSec: 100 },
      () => 0,
    );
    expect(s.layers).toBeLessThanOrEqual(0);
  });

  it('converts to snow block at 8 layers', () => {
    const s = makeSnowLayer(7);
    const r = tickSnowLayer(
      s,
      { isSnowing: true, lightLevel: 0, surfaceTemperature: 0, dtSec: 100 },
      () => 0,
    );
    expect(r.converted).toBe(true);
  });
});
