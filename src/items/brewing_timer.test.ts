import { describe, it, expect } from 'vitest';
import { startBrew, tick, addBlazePowder, progress01, BREW_TICKS } from './brewing_timer';

describe('brewing timer', () => {
  it('no brew without fuel', () => {
    const s = startBrew({ ticksRemaining: 0, fuelUses: 0 });
    expect(s.ticksRemaining).toBe(0);
  });

  it('brew with fuel', () => {
    const s = startBrew({ ticksRemaining: 0, fuelUses: 1 });
    expect(s.ticksRemaining).toBe(BREW_TICKS);
  });

  it('tick decrements', () => {
    const r = tick({ ticksRemaining: 100, fuelUses: 1 });
    expect(r.state.ticksRemaining).toBe(99);
    expect(r.finished).toBe(false);
  });

  it('final tick finishes + consumes fuel', () => {
    const r = tick({ ticksRemaining: 1, fuelUses: 3 });
    expect(r.finished).toBe(true);
    expect(r.state.fuelUses).toBe(2);
  });

  it('blaze powder adds 20 uses', () => {
    expect(addBlazePowder({ ticksRemaining: 0, fuelUses: 0 }).fuelUses).toBe(20);
  });

  it('progress 0 at full time', () => {
    expect(progress01({ ticksRemaining: BREW_TICKS, fuelUses: 1 })).toBe(0);
  });

  it('progress 1 near done', () => {
    expect(progress01({ ticksRemaining: 1, fuelUses: 1 })).toBeCloseTo(0.9975);
  });
});
