import { describe, it, expect } from 'vitest';
import { tickBreakDoor, attackTargetKinds, BREAK_TICKS_HARD } from './vindicator_door_break';

describe('vindicator', () => {
  it('outside raid ignores doors', () => {
    const v = { inRaid: false, breakTargetPos: null, breakProgress: 0, isJohnny: false };
    expect(
      tickBreakDoor(v, {
        difficulty: 'hard',
        doorPos: { x: 0, y: 0, z: 0 },
        deltaTicks: 1000,
      }),
    ).toBe('not_attacking');
  });

  it('breaks during raid', () => {
    const v = { inRaid: true, breakTargetPos: null, breakProgress: 0, isJohnny: false };
    expect(
      tickBreakDoor(v, {
        difficulty: 'hard',
        doorPos: { x: 0, y: 0, z: 0 },
        deltaTicks: BREAK_TICKS_HARD,
      }),
    ).toBe('broken');
  });

  it('johnny breaks without raid', () => {
    const v = { inRaid: false, breakTargetPos: null, breakProgress: 0, isJohnny: true };
    expect(
      tickBreakDoor(v, {
        difficulty: 'normal',
        doorPos: { x: 0, y: 0, z: 0 },
        deltaTicks: 10,
      }),
    ).toBe('progress');
  });

  it('target kinds', () => {
    expect(
      attackTargetKinds({ inRaid: true, breakTargetPos: null, breakProgress: 0, isJohnny: false }),
    ).toContain('villager');
    expect(
      attackTargetKinds({ inRaid: false, breakTargetPos: null, breakProgress: 0, isJohnny: true })
        .length,
    ).toBeGreaterThan(3);
  });
});
