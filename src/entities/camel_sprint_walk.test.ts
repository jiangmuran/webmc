import { describe, it, expect } from 'vitest';
import { effectiveSpeed, canCarryTwo, skipsOnePassengerSwimDamage } from './camel_sprint_walk';

describe('camel sprint walk', () => {
  it('sitting stops', () => {
    expect(effectiveSpeed({ riders: 1, sprinting: true, sitting: true })).toBe(0);
  });

  it('sprint faster', () => {
    expect(effectiveSpeed({ riders: 1, sprinting: true, sitting: false })).toBeGreaterThan(
      effectiveSpeed({ riders: 1, sprinting: false, sitting: false }),
    );
  });

  it('two riders supported', () => {
    expect(canCarryTwo()).toBe(true);
  });

  it('swim damage skip', () => {
    expect(skipsOnePassengerSwimDamage()).toBe(true);
  });
});
