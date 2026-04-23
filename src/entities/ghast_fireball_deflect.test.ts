import { describe, it, expect } from 'vitest';
import { isDeflected, deflectsTowardAttacker } from './ghast_fireball_deflect';

describe('ghast fireball deflect', () => {
  it('punch deflects', () => {
    expect(isDeflected({ hitByPunch: true, hitByArrow: false, hitByTrident: false })).toBe(true);
  });

  it('arrow deflects', () => {
    expect(isDeflected({ hitByPunch: false, hitByArrow: true, hitByTrident: false })).toBe(true);
  });

  it('nothing no deflect', () => {
    expect(isDeflected({ hitByPunch: false, hitByArrow: false, hitByTrident: false })).toBe(false);
  });

  it('sends back', () => {
    expect(deflectsTowardAttacker()).toBe(true);
  });
});
