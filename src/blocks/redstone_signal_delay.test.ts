import { describe, it, expect } from 'vitest';
import { makeRepeater, cycleDelay, onInputChange, tickRepeater } from './redstone_signal_delay';

describe('repeater delay', () => {
  it('cycle 1..4', () => {
    const r = makeRepeater();
    cycleDelay(r);
    expect(r.delayTicks).toBe(2);
    cycleDelay(r);
    cycleDelay(r);
    cycleDelay(r);
    expect(r.delayTicks).toBe(1);
  });

  it('schedules delay ticks', () => {
    const r = makeRepeater(3);
    onInputChange(r, { nowTick: 0, newInputPowered: true });
    expect(r.scheduledToggleAtTick).toBe(6);
  });

  it('tick toggles after delay', () => {
    const r = makeRepeater(2);
    onInputChange(r, { nowTick: 0, newInputPowered: true });
    expect(tickRepeater(r, 3)).toBe(false);
    expect(tickRepeater(r, 4)).toBe(true);
    expect(r.outputPowered).toBe(true);
  });

  it('no change = no schedule', () => {
    const r = { delayTicks: 1 as const, scheduledToggleAtTick: null, outputPowered: false };
    onInputChange(r, { nowTick: 0, newInputPowered: false });
    expect(r.scheduledToggleAtTick).toBeNull();
  });
});
