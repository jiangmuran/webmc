import { describe, it, expect } from 'vitest';
import { makeObserver, onNeighborUpdate, tickObserver, PULSE_TICKS } from './observer_detect_edge';

describe('observer', () => {
  it('no pulse without state change', () => {
    const s = makeObserver('facing=up');
    expect(onNeighborUpdate(s, { newStateSig: 'facing=up' })).toBe(false);
    expect(tickObserver(s).output).toBe(0);
  });

  it('pulses on change', () => {
    const s = makeObserver('a');
    expect(onNeighborUpdate(s, { newStateSig: 'b' })).toBe(true);
    expect(tickObserver(s).output).toBe(15);
    // allow some extra steps equal to PULSE_TICKS
    for (let i = 0; i < PULSE_TICKS; i++) tickObserver(s);
    expect(tickObserver(s).output).toBe(0);
  });

  it('updates the watched sig', () => {
    const s = makeObserver('a');
    onNeighborUpdate(s, { newStateSig: 'b' });
    expect(s.watchedStateSig).toBe('b');
    expect(onNeighborUpdate(s, { newStateSig: 'b' })).toBe(false);
  });
});
