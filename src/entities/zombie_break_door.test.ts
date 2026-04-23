import { describe, it, expect } from 'vitest';
import { canBreakDoor, breakProgress, BREAK_TICKS } from './zombie_break_door';

describe('zombie break door', () => {
  it('hard zombie breaks', () => {
    expect(
      canBreakDoor({
        difficulty: 'hard',
        isZombie: true,
        isVindicator: false,
        targetAccess: 'locked',
      }),
    ).toBe(true);
  });

  it('normal zombie cannot', () => {
    expect(
      canBreakDoor({
        difficulty: 'normal',
        isZombie: true,
        isVindicator: false,
        targetAccess: 'locked',
      }),
    ).toBe(false);
  });

  it('vindicator always can', () => {
    expect(
      canBreakDoor({
        difficulty: 'easy',
        isZombie: false,
        isVindicator: true,
        targetAccess: 'locked',
      }),
    ).toBe(true);
  });

  it('open door no need', () => {
    expect(
      canBreakDoor({
        difficulty: 'hard',
        isZombie: true,
        isVindicator: true,
        targetAccess: 'open',
      }),
    ).toBe(false);
  });

  it('progress caps at 1', () => {
    expect(breakProgress(BREAK_TICKS * 2, 1)).toBe(1);
  });

  it('multiplier accelerates', () => {
    expect(breakProgress(60, 2)).toBeCloseTo(0.5);
  });
});
