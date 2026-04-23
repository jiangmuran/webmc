import { describe, it, expect } from 'vitest';
import { onRedstoneEdge, lightLevel } from './copper_bulb_toggle';

describe('copper bulb toggle', () => {
  it('edge flips', () => {
    const b = { lit: false, stage: 'new' as const, powered: false };
    expect(onRedstoneEdge(b, true).lit).toBe(true);
  });

  it('no-edge no change', () => {
    const b = { lit: false, stage: 'new' as const, powered: true };
    expect(onRedstoneEdge(b, false).lit).toBe(false);
  });

  it('new stage brightest', () => {
    expect(lightLevel({ lit: true, stage: 'new', powered: false })).toBeGreaterThan(
      lightLevel({ lit: true, stage: 'oxidized', powered: false }),
    );
  });

  it('unlit 0', () => {
    expect(lightLevel({ lit: false, stage: 'new', powered: false })).toBe(0);
  });
});
