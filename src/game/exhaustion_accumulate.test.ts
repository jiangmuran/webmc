import { describe, it, expect } from 'vitest';
import { addExhaustion, SATURATION_CONSUMES_AT } from './exhaustion_accumulate';

describe('exhaustion accumulate', () => {
  it('sprint adds exhaustion', () => {
    const s = addExhaustion({ exhaustion: 0, saturation: 5, hunger: 20 }, 'sprint');
    expect(s.exhaustion).toBeCloseTo(0.1);
  });

  it('drains saturation at threshold', () => {
    const s = addExhaustion(
      { exhaustion: SATURATION_CONSUMES_AT, saturation: 5, hunger: 20 },
      'mine',
    );
    expect(s.saturation).toBeLessThan(5);
  });

  it('drains hunger when saturation 0', () => {
    const s = addExhaustion(
      { exhaustion: SATURATION_CONSUMES_AT - 0.0001, saturation: 0, hunger: 20 },
      'mine',
    );
    expect(s.hunger).toBe(19);
  });

  it('hunger never below 0', () => {
    let state = { exhaustion: 0, saturation: 0, hunger: 1 };
    for (let i = 0; i < 200; i++) state = addExhaustion(state, 'regen');
    expect(state.hunger).toBe(0);
  });
});
