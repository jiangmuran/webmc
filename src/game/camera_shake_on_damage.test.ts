import { describe, it, expect } from 'vitest';
import { onDamage, tick, currentOffset } from './camera_shake_on_damage';

describe('camera shake on damage', () => {
  it('damage sets amplitude', () => {
    const s = onDamage({ ticksRemaining: 0, amplitude: 0 }, 5);
    expect(s.amplitude).toBeGreaterThan(0);
  });

  it('tick decrements', () => {
    const s = tick({ ticksRemaining: 5, amplitude: 0.5 });
    expect(s.ticksRemaining).toBe(4);
  });

  it('no shake at rest', () => {
    expect(currentOffset({ ticksRemaining: 0, amplitude: 0 }, () => 0.5)).toEqual({
      dx: 0,
      dy: 0,
    });
  });

  it('offset within amplitude', () => {
    const o = currentOffset({ ticksRemaining: 5, amplitude: 1 }, () => 1);
    expect(Math.abs(o.dx)).toBeLessThanOrEqual(1);
  });
});
