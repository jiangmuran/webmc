import { describe, it, expect } from 'vitest';
import { hudDistortionAlpha, endermanAggroOnStare, usableAsHelmet } from './carved_pumpkin_wear';

describe('carved pumpkin wear', () => {
  it('not wearing → no distortion', () => {
    expect(hudDistortionAlpha({ wearing: false, lookingAtEnderman: false })).toBe(0);
  });

  it('wearing distorts', () => {
    expect(hudDistortionAlpha({ wearing: true, lookingAtEnderman: false })).toBeGreaterThan(0);
  });

  it('pumpkin blocks enderman aggro', () => {
    expect(endermanAggroOnStare({ wearing: true, lookingAtEnderman: true })).toBe(false);
    expect(endermanAggroOnStare({ wearing: false, lookingAtEnderman: true })).toBe(true);
  });

  it('is helmet', () => {
    expect(usableAsHelmet()).toBe(true);
  });
});
