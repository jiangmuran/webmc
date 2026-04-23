import { describe, it, expect } from 'vitest';
import { onBlockUpdate, isPowered, outputSignal, OUTPUT_DURATION_TICKS } from './observer_schedule';

describe('observer schedule', () => {
  it('starts powered on change', () => {
    const o = onBlockUpdate(0);
    expect(isPowered(o, 0)).toBe(true);
  });

  it('stops after duration', () => {
    const o = onBlockUpdate(0);
    expect(isPowered(o, OUTPUT_DURATION_TICKS)).toBe(false);
  });

  it('signal 15 while active', () => {
    expect(outputSignal(onBlockUpdate(0), 0)).toBe(15);
    expect(outputSignal(onBlockUpdate(0), 100)).toBe(0);
  });
});
