import { describe, it, expect } from 'vitest';
import {
  bumpAnger,
  highestAngerTarget,
  currentAttack,
  decayAnger,
  MAX_ANGER,
  SONIC_THRESHOLD,
  MELEE_THRESHOLD,
} from './warden_detect_scan';

describe('warden anger', () => {
  it('bump and get', () => {
    const a = { byEntity: new Map<string, number>() };
    bumpAnger(a, 'Steve', 20);
    bumpAnger(a, 'Steve', 20);
    expect(highestAngerTarget(a)?.anger).toBe(40);
  });

  it('capped at max', () => {
    const a = { byEntity: new Map<string, number>() };
    bumpAnger(a, 'Steve', 1000);
    expect(a.byEntity.get('Steve')).toBe(MAX_ANGER);
  });

  it('attack thresholds (wiki: suspect 35, target 80)', () => {
    expect(MELEE_THRESHOLD).toBe(35);
    expect(SONIC_THRESHOLD).toBe(80);
    const a = { byEntity: new Map<string, number>() };
    bumpAnger(a, 'Steve', MELEE_THRESHOLD - 1);
    expect(currentAttack(a).attack).toBe('idle');
    bumpAnger(a, 'Steve', 5);
    expect(currentAttack(a).attack).toBe('melee');
    bumpAnger(a, 'Steve', SONIC_THRESHOLD);
    expect(currentAttack(a).attack).toBe('sonic');
  });

  it('decay clears', () => {
    const a = { byEntity: new Map<string, number>() };
    bumpAnger(a, 'Steve', 10);
    decayAnger(a, 20);
    expect(a.byEntity.has('Steve')).toBe(false);
  });
});
