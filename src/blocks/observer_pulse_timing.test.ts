import { describe, it, expect } from 'vitest';
import {
  onWorldTick,
  outputPower,
  triggersByBlockState,
  OBSERVER_PULSE_TICKS,
} from './observer_pulse_timing';

describe('observer pulse timing', () => {
  it('no change no pulse', () => {
    const s = onWorldTick({ frontBlockState: 'stone', ticksRemaining: 0 }, 'stone');
    expect(outputPower(s)).toBe(0);
  });

  it('state change triggers', () => {
    const s = onWorldTick({ frontBlockState: 'stone', ticksRemaining: 0 }, 'cobblestone');
    expect(s.ticksRemaining).toBe(OBSERVER_PULSE_TICKS);
    expect(outputPower(s)).toBe(15);
  });

  it('tick decays', () => {
    let s = { frontBlockState: 'cobblestone', ticksRemaining: OBSERVER_PULSE_TICKS };
    for (let i = 0; i < OBSERVER_PULSE_TICKS; i++) s = onWorldTick(s, 'cobblestone');
    expect(outputPower(s)).toBe(0);
  });

  it('triggers on state', () => {
    expect(triggersByBlockState()).toBe(true);
  });
});
