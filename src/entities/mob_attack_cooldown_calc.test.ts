import { describe, it, expect } from 'vitest';
import {
  makeAttackState,
  intervalMs,
  canAttack,
  markAttacked,
  adjustedSpeed,
} from './mob_attack_cooldown_calc';

describe('mob attack cd', () => {
  it('interval from speed', () => {
    expect(intervalMs(makeAttackState(2))).toBe(500);
  });

  it('fresh can attack', () => {
    expect(canAttack(makeAttackState(), 0)).toBe(true);
  });

  it('after mark wait', () => {
    const s = makeAttackState(2);
    markAttacked(s, 0);
    expect(canAttack(s, 100)).toBe(false);
    expect(canAttack(s, 501)).toBe(true);
  });

  it('haste/slow stack', () => {
    expect(adjustedSpeed(2, true, false)).toBe(3);
    expect(adjustedSpeed(2, false, true)).toBe(1);
    expect(adjustedSpeed(2, true, true)).toBe(1.5);
  });

  it('zero speed never attacks', () => {
    expect(intervalMs(makeAttackState(0))).toBe(Infinity);
  });
});
