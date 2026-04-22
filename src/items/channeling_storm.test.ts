import { describe, it, expect } from 'vitest';
import { summonsLightning, incompatibleWith, requiresHit } from './channeling_storm';

describe('channeling', () => {
  it('all conditions triggers', () => {
    expect(
      summonsLightning({ hasChanneling: true, thunderstorm: true, targetUnderOpenSky: true }),
    ).toBe(true);
  });

  it('no storm no lightning', () => {
    expect(
      summonsLightning({ hasChanneling: true, thunderstorm: false, targetUnderOpenSky: true }),
    ).toBe(false);
  });

  it('indoor no lightning', () => {
    expect(
      summonsLightning({ hasChanneling: true, thunderstorm: true, targetUnderOpenSky: false }),
    ).toBe(false);
  });

  it('no enchant no lightning', () => {
    expect(
      summonsLightning({ hasChanneling: false, thunderstorm: true, targetUnderOpenSky: true }),
    ).toBe(false);
  });

  it('incompat riptide', () => {
    expect(incompatibleWith()).toContain('riptide');
  });

  it('requires hit', () => {
    expect(requiresHit()).toBe(true);
  });
});
