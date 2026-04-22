import { describe, it, expect } from 'vitest';
import { beamAfterGlass, beamBaseColor, finalBeamColor } from './beacon_beam';

describe('beacon beam', () => {
  it('base is white', () => {
    expect(beamBaseColor()).toEqual([255, 255, 255]);
  });

  it('single red glass tints', () => {
    const c = beamAfterGlass([255, 255, 255], 'red');
    expect(c[0]).toBeGreaterThan(c[1]);
    expect(c[0]).toBeGreaterThan(c[2]);
  });

  it('final beam averages a chain', () => {
    const c = finalBeamColor(['red', 'blue']);
    expect(c[0]).toBeLessThan(255);
    expect(c[2]).toBeLessThan(255);
  });

  it('no glass = base color', () => {
    expect(finalBeamColor([])).toEqual([255, 255, 255]);
  });
});
