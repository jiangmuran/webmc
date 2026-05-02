import { describe, it, expect } from 'vitest';
import {
  raidersHighlighted,
  highlightDurationTicks,
  TRIGGER_RADIUS,
  APPLY_RADIUS,
} from './bell_ring_damage_raiders';

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

  it('skips non-raider (no trigger)', () => {
    expect(raidersHighlighted(0, 0, [nearVillager])).toHaveLength(0);
  });

  it('duration positive', () => {
    expect(highlightDurationTicks()).toBeGreaterThan(0);
  });

  it('wiki: 32-block trigger, 48-block apply', () => {
    expect(TRIGGER_RADIUS).toBe(32);
    expect(APPLY_RADIUS).toBe(48);
  });

  it('raider in 32-48 shell glows when one raider is inside 32 (wiki)', () => {
    // A raider at distance 40 alone does NOT trigger glow.
    const at40 = { x: 40, z: 0, isRaider: true };
    expect(raidersHighlighted(0, 0, [at40])).toHaveLength(0);

    // But if another raider is within the 32-trigger, both glow
    // — since both are within the 48-apply radius.
    const at10 = { x: 10, z: 0, isRaider: true };
    expect(raidersHighlighted(0, 0, [at10, at40])).toHaveLength(2);
  });

  it('raider beyond 48 never glows even if another raider triggers', () => {
    const at10 = { x: 10, z: 0, isRaider: true };
    const at60 = { x: 60, z: 0, isRaider: true };
    expect(raidersHighlighted(0, 0, [at10, at60])).toHaveLength(1);
  });
});
