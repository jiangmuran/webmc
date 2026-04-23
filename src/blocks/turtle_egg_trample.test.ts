import { describe, it, expect } from 'vitest';
import { tramplesOnStep, hatchAgeTicks } from './turtle_egg_trample';

describe('turtle egg trample', () => {
  it('adult tramples sometimes', () => {
    expect(
      tramplesOnStep({ entityWeight: 1, entityIsBaby: false, hasFeatherFalling: false }, () => 0),
    ).toBe(true);
  });

  it('baby does not', () => {
    expect(
      tramplesOnStep({ entityWeight: 1, entityIsBaby: true, hasFeatherFalling: false }, () => 0),
    ).toBe(false);
  });

  it('feather falling saves', () => {
    expect(
      tramplesOnStep({ entityWeight: 2, entityIsBaby: false, hasFeatherFalling: true }, () => 0),
    ).toBe(false);
  });

  it('hatch is multi-day', () => {
    expect(hatchAgeTicks()).toBeGreaterThan(48000);
  });
});
