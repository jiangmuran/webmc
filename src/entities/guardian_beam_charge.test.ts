import { describe, it, expect } from 'vitest';
import { makeBeam, tickBeam, CHARGE_TICKS, COOLDOWN_TICKS } from './guardian_beam_charge';

describe('guardian beam', () => {
  it('acquires target → charges → fires → cools down', () => {
    const s = makeBeam();
    tickBeam(s, { target: { id: 'p', distance: 5, hasLineOfSight: true } });
    expect(s.phase).toBe('charging');
    for (let i = 0; i < CHARGE_TICKS; i++) {
      tickBeam(s, { target: { id: 'p', distance: 5, hasLineOfSight: true } });
    }
    expect(s.phase === 'firing' || s.phase === 'cooldown').toBe(true);
    for (let i = 0; i < COOLDOWN_TICKS + 5; i++) {
      tickBeam(s, { target: null });
    }
    expect(s.phase).toBe('idle');
  });

  it('loses target on range', () => {
    const s = makeBeam();
    tickBeam(s, { target: { id: 'p', distance: 5, hasLineOfSight: true } });
    tickBeam(s, { target: { id: 'p', distance: 50, hasLineOfSight: true } });
    expect(s.phase).toBe('idle');
  });

  it('loses target on LOS break', () => {
    const s = makeBeam();
    tickBeam(s, { target: { id: 'p', distance: 5, hasLineOfSight: true } });
    tickBeam(s, { target: { id: 'p', distance: 5, hasLineOfSight: false } });
    expect(s.phase).toBe('idle');
  });

  it('switching target resets', () => {
    const s = makeBeam();
    tickBeam(s, { target: { id: 'a', distance: 5, hasLineOfSight: true } });
    tickBeam(s, { target: { id: 'b', distance: 5, hasLineOfSight: true } });
    expect(s.phase).toBe('idle');
  });
});
