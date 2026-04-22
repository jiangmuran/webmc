import { describe, it, expect } from 'vitest';
import { makeRavager, tickRavager, WIND_TICKS, DASH_TICKS, STUN_TICKS } from './ravager_charge';

describe('ravager', () => {
  it('full cycle', () => {
    const r = makeRavager();
    tickRavager(r, { targetInRange: true, targetId: 'p' });
    expect(r.phase).toBe('winding');
    for (let i = 0; i < WIND_TICKS; i++) tickRavager(r, { targetInRange: true, targetId: 'p' });
    expect(r.phase).toBe('dashing');
    for (let i = 0; i < DASH_TICKS; i++) tickRavager(r, { targetInRange: true, targetId: 'p' });
    expect(r.phase).toBe('stunned');
    for (let i = 0; i < STUN_TICKS; i++) tickRavager(r, { targetInRange: false, targetId: null });
    expect(r.phase).toBe('idle');
  });

  it('idle without target', () => {
    const r = makeRavager();
    tickRavager(r, { targetInRange: false, targetId: null });
    expect(r.phase).toBe('idle');
  });

  it('begin_dash event fires', () => {
    const r = makeRavager();
    tickRavager(r, { targetInRange: true, targetId: 'p' });
    for (let i = 0; i < WIND_TICKS - 1; i++) tickRavager(r, { targetInRange: true, targetId: 'p' });
    const res = tickRavager(r, { targetInRange: true, targetId: 'p' });
    expect(res.event).toBe('begin_dash');
  });
});
