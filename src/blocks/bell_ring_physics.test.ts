import { describe, it, expect } from 'vitest';
import { onHit, tick, swingAngle, isActive, BELL_SWING_DURATION_TICKS } from './bell_ring_physics';

describe('bell ring physics', () => {
  it('hit sets swing', () => {
    const s = onHit({ swingTicksRemaining: 0, lastHitSide: null }, 'north');
    expect(s.swingTicksRemaining).toBe(BELL_SWING_DURATION_TICKS);
    expect(s.lastHitSide).toBe('north');
  });

  it('tick decays', () => {
    expect(tick({ swingTicksRemaining: 5, lastHitSide: 'rope' }).swingTicksRemaining).toBe(4);
  });

  it('idle angle zero', () => {
    expect(swingAngle({ swingTicksRemaining: 0, lastHitSide: null })).toBe(0);
  });

  it('active during swing', () => {
    expect(isActive({ swingTicksRemaining: 10, lastHitSide: 'rope' })).toBe(true);
    expect(isActive({ swingTicksRemaining: 0, lastHitSide: 'rope' })).toBe(false);
  });
});
