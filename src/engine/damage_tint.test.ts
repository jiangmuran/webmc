import { describe, it, expect } from 'vitest';
import { onDamaged, tick, currentAlpha, DAMAGE_TINT_DURATION_TICKS } from './damage_tint';

describe('damage tint', () => {
  it('on damage sets duration', () => {
    expect(onDamaged(5).ticksRemaining).toBe(DAMAGE_TINT_DURATION_TICKS);
  });

  it('strong damage higher peak', () => {
    expect(onDamaged(10).peakIntensity).toBeGreaterThan(onDamaged(2).peakIntensity);
  });

  it('peak caps at 1', () => {
    expect(onDamaged(100).peakIntensity).toBe(1);
  });

  it('tick decays', () => {
    let s = onDamaged(5);
    for (let i = 0; i < DAMAGE_TINT_DURATION_TICKS; i++) s = tick(s);
    expect(s.ticksRemaining).toBe(0);
  });

  it('alpha 0 when idle', () => {
    expect(currentAlpha({ ticksRemaining: 0, peakIntensity: 1 })).toBe(0);
  });

  it('alpha peaks at fresh hit', () => {
    const s = onDamaged(10);
    expect(currentAlpha(s)).toBeCloseTo(1);
  });
});
