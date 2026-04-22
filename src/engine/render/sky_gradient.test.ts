import { describe, it, expect } from 'vitest';
import { ambientIntensity, skyAt } from './sky_gradient';

describe('sky gradient', () => {
  it('dawn gives warm horizon', () => {
    const s = skyAt(0);
    expect(s.horizon[0]).toBeGreaterThan(s.horizon[2]);
  });

  it('noon has a blue zenith', () => {
    const s = skyAt(0.25);
    expect(s.zenith[2]).toBeGreaterThan(s.zenith[0]);
  });

  it('midnight is dark', () => {
    const s = skyAt(0.75);
    expect(s.zenith[0] + s.zenith[1] + s.zenith[2]).toBeLessThan(80);
  });

  it('ambient peaks at noon', () => {
    expect(ambientIntensity(0.25)).toBeCloseTo(1);
  });

  it('ambient troughs at midnight', () => {
    expect(ambientIntensity(0.75)).toBeCloseTo(0);
  });

  it('ambient midway at dawn/dusk', () => {
    expect(ambientIntensity(0)).toBeCloseTo(0.5);
    expect(ambientIntensity(0.5)).toBeCloseTo(0.5);
  });
});
