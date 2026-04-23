import { describe, it, expect } from 'vitest';
import { onStrike, tick, redstoneOutput, isActive, PULSE_TICKS } from './lightning_rod_redstone';

describe('lightning rod redstone', () => {
  it('strike sets pulse', () => {
    expect(onStrike().ticksRemaining).toBe(PULSE_TICKS);
  });

  it('tick decays', () => {
    expect(tick({ ticksRemaining: PULSE_TICKS }).ticksRemaining).toBe(PULSE_TICKS - 1);
  });

  it('output 15 while active', () => {
    expect(redstoneOutput({ ticksRemaining: 1 })).toBe(15);
  });

  it('output 0 idle', () => {
    expect(redstoneOutput({ ticksRemaining: 0 })).toBe(0);
  });

  it('isActive flag', () => {
    expect(isActive({ ticksRemaining: 1 })).toBe(true);
    expect(isActive({ ticksRemaining: 0 })).toBe(false);
  });
});
