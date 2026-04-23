import { describe, it, expect } from 'vitest';
import { raidersHighlighted, highlightDurationTicks } from './bell_ring_damage_raiders';

describe('bell highlight raiders', () => {
  const near = { x: 0, z: 0, isRaider: true };
  const far = { x: 100, z: 0, isRaider: true };
  const nearVillager = { x: 1, z: 0, isRaider: false };

  it('highlights close raider', () => {
    expect(raidersHighlighted(0, 0, [near])).toHaveLength(1);
  });

  it('skips far raider', () => {
    expect(raidersHighlighted(0, 0, [far])).toHaveLength(0);
  });

  it('skips non-raider', () => {
    expect(raidersHighlighted(0, 0, [nearVillager])).toHaveLength(0);
  });

  it('duration positive', () => {
    expect(highlightDurationTicks()).toBeGreaterThan(0);
  });
});
