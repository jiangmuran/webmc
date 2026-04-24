import { describe, it, expect } from 'vitest';
import {
  isBroken,
  tickSecond,
  repairWithPhantomMembrane,
  MAX_ELYTRA_DURABILITY,
  type ElytraState,
} from './elytra_durability_glide';

const fresh: ElytraState = {
  durability: MAX_ELYTRA_DURABILITY,
  isGliding: true,
  secondsGliding: 0,
  unbreakingLevel: 0,
};

describe('elytra durability glide', () => {
  it('fresh not broken', () => {
    expect(isBroken(fresh)).toBe(false);
  });

  it('depleted broken', () => {
    expect(isBroken({ ...fresh, durability: 0 })).toBe(true);
  });

  it('tick drains durability', () => {
    expect(tickSecond(fresh, () => 1).durability).toBe(MAX_ELYTRA_DURABILITY - 1);
  });

  it('unbreaking sometimes saves', () => {
    expect(tickSecond({ ...fresh, unbreakingLevel: 3 }, () => 0.01).durability).toBe(
      MAX_ELYTRA_DURABILITY,
    );
  });

  it('not gliding no loss', () => {
    expect(tickSecond({ ...fresh, isGliding: false }, () => 1).durability).toBe(
      MAX_ELYTRA_DURABILITY,
    );
  });

  it('phantom membrane repairs', () => {
    const damaged: ElytraState = { ...fresh, durability: 100 };
    expect(repairWithPhantomMembrane(damaged, 2).durability).toBeGreaterThan(100);
  });

  it('repair capped at max', () => {
    expect(repairWithPhantomMembrane(fresh, 5).durability).toBe(MAX_ELYTRA_DURABILITY);
  });
});
