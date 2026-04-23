import { describe, it, expect } from 'vitest';
import { breakSpeedPerTick, ticksToBreak, type BreakCtx } from './break_speed';

const base: BreakCtx = {
  hardness: 1.5,
  correctTool: true,
  toolSpeed: 4,
  onGround: true,
  underwater: false,
  hasAquaAffinity: false,
  hasteLevel: 0,
  fatigueLevel: 0,
  efficiencyBonus: 0,
};

describe('break speed', () => {
  it('correct tool faster than wrong', () => {
    const c1 = breakSpeedPerTick({ ...base, correctTool: true });
    const c2 = breakSpeedPerTick({ ...base, correctTool: false });
    expect(c1).toBeGreaterThan(c2);
  });

  it('airborne slower', () => {
    expect(breakSpeedPerTick({ ...base, onGround: false })).toBeLessThan(breakSpeedPerTick(base));
  });

  it('haste faster', () => {
    expect(breakSpeedPerTick({ ...base, hasteLevel: 2 })).toBeGreaterThan(breakSpeedPerTick(base));
  });

  it('fatigue slower', () => {
    expect(breakSpeedPerTick({ ...base, fatigueLevel: 3 })).toBeLessThan(breakSpeedPerTick(base));
  });

  it('instant for hardness 0', () => {
    expect(ticksToBreak({ ...base, hardness: 0 })).toBe(0);
  });

  it('infinite for unbreakable', () => {
    expect(ticksToBreak({ ...base, hardness: -1 })).toBe(Infinity);
  });

  it('stone breaks ≤ 1s with iron', () => {
    const t = ticksToBreak({ ...base, hardness: 1.5, toolSpeed: 6 });
    expect(t).toBeLessThanOrEqual(20);
  });
});
