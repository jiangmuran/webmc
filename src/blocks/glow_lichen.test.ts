import { describe, it, expect } from 'vitest';
import { addFace, boneMealSpread, lightEmission, makeGlowLichen } from './glow_lichen';

describe('glow lichen', () => {
  it('light emission is 7', () => {
    expect(lightEmission()).toBe(7);
  });

  it('add new face', () => {
    const g = makeGlowLichen('up');
    expect(addFace(g, 'north')).toBe(true);
    expect(addFace(g, 'north')).toBe(false);
  });

  it('bone meal spreads to solid neighbours', () => {
    const placements = boneMealSpread(
      { x: 0, y: 0, z: 0 },
      { hasSolidFace: () => true },
      () => 0.1,
    );
    expect(placements.length).toBeGreaterThan(0);
  });

  it('no spread without solid face', () => {
    const placements = boneMealSpread(
      { x: 0, y: 0, z: 0 },
      { hasSolidFace: () => false },
      () => 0.1,
    );
    expect(placements.length).toBe(0);
  });
});
