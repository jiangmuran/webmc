import { describe, it, expect } from 'vitest';
import { pickBastion, guaranteedLoot, piglinGuardCount, BASTION_WEIGHTS } from './bastion_types';

describe('bastion types', () => {
  it('pick returns a kind', () => {
    const k = pickBastion(() => 0.5);
    expect(Object.keys(BASTION_WEIGHTS)).toContain(k);
  });

  it('treasure has netherite', () => {
    expect(guaranteedLoot('treasure')).toContain('netherite_ingot');
  });

  it('guards scale', () => {
    expect(piglinGuardCount('housing_units')).toBeGreaterThan(piglinGuardCount('hoglin_stable'));
  });

  it('low roll = first kind', () => {
    expect(pickBastion(() => 0)).toBe('hoglin_stable');
  });
});
