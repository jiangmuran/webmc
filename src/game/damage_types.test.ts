import { describe, it, expect } from 'vitest';
import { getType, allTypeIds } from './damage_types';

describe('damage types', () => {
  it('freeze bypasses armor', () => {
    expect(getType('freeze').bypassesArmor).toBe(true);
  });

  it('fire is fire', () => {
    expect(getType('fire').isFire).toBe(true);
    expect(getType('arrow').isFire).toBe(false);
  });

  it('void bypasses invuln', () => {
    expect(getType('void').bypassesInvulnerability).toBe(true);
  });

  it('arrow scales with difficulty', () => {
    expect(getType('arrow').scalesWithDifficulty).toBe(true);
  });

  it('all types registered', () => {
    expect(allTypeIds().length).toBeGreaterThan(15);
  });
});
