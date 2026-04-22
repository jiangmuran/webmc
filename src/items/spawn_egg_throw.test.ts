import { describe, it, expect } from 'vitest';
import { use, dispenserThrowsAsEgg, SPAWN_EGG_MAX_STACK } from './spawn_egg_throw';

describe('spawn egg throw', () => {
  it('spawn on block', () => {
    expect(
      use({ target: 'block', targetMobType: null, eggMobType: 'cow', isBabyAction: true }),
    ).toEqual({ kind: 'spawned', mobType: 'cow' });
  });

  it('baby on matching mob', () => {
    expect(
      use({ target: 'mob', targetMobType: 'cow', eggMobType: 'cow', isBabyAction: true }),
    ).toEqual({ kind: 'spawned_baby', mobType: 'cow' });
  });

  it('mismatched mob invalid', () => {
    expect(
      use({ target: 'mob', targetMobType: 'cow', eggMobType: 'pig', isBabyAction: true }),
    ).toEqual({ kind: 'invalid' });
  });

  it('air invalid', () => {
    expect(
      use({ target: 'air', targetMobType: null, eggMobType: 'cow', isBabyAction: true }),
    ).toEqual({ kind: 'invalid' });
  });

  it('dispenser throws', () => {
    expect(dispenserThrowsAsEgg()).toBe(true);
  });

  it('max stack 64', () => {
    expect(SPAWN_EGG_MAX_STACK).toBe(64);
  });
});
