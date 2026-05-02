import { describe, it, expect } from 'vitest';
import {
  speedMultiplier,
  boostsJump,
  damageChancePerStep,
  piglinHostileTrigger,
} from './soul_speed';

describe('soul speed', () => {
  it('no effect off soul block', () => {
    expect(speedMultiplier({ onSoulBlock: false, level: 3 })).toBe(1);
  });

  it('speed up on soul block (wiki: L × 0.105 + 1.3)', () => {
    expect(speedMultiplier({ onSoulBlock: true, level: 1 })).toBeCloseTo(1.405);
    expect(speedMultiplier({ onSoulBlock: true, level: 2 })).toBeCloseTo(1.51);
    expect(speedMultiplier({ onSoulBlock: true, level: 3 })).toBeCloseTo(1.615);
  });

  it('no level no speed', () => {
    expect(speedMultiplier({ onSoulBlock: true, level: 0 })).toBe(1);
  });

  it('boost jump only on soul', () => {
    expect(boostsJump({ onSoulBlock: true, level: 1 })).toBe(true);
    expect(boostsJump({ onSoulBlock: false, level: 1 })).toBe(false);
  });

  it('damage chance only with level', () => {
    expect(damageChancePerStep(0)).toBe(0);
    expect(damageChancePerStep(3)).toBeGreaterThan(0);
  });

  it('piglins hate', () => {
    expect(piglinHostileTrigger()).toBe(true);
  });
});
