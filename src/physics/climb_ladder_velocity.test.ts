import { describe, it, expect } from 'vitest';
import { verticalVelocity } from './climb_ladder_velocity';

describe('climb ladder velocity', () => {
  it('air falls', () => {
    expect(
      verticalVelocity({
        onLadder: false,
        onVine: false,
        onScaffolding: false,
        sneaking: false,
        pressingUp: false,
        pressingDown: false,
      }),
    ).toBeLessThan(0);
  });

  it('ladder up climbs', () => {
    expect(
      verticalVelocity({
        onLadder: true,
        onVine: false,
        onScaffolding: false,
        sneaking: false,
        pressingUp: true,
        pressingDown: false,
      }),
    ).toBeGreaterThan(0);
  });

  it('sneak holds', () => {
    expect(
      verticalVelocity({
        onLadder: true,
        onVine: false,
        onScaffolding: false,
        sneaking: true,
        pressingUp: true,
        pressingDown: false,
      }),
    ).toBe(0);
  });

  it('ladder down descends', () => {
    expect(
      verticalVelocity({
        onLadder: true,
        onVine: false,
        onScaffolding: false,
        sneaking: false,
        pressingUp: false,
        pressingDown: true,
      }),
    ).toBeLessThan(0);
  });
});
