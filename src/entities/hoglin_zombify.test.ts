import { describe, it, expect } from 'vitest';
import { tickZombify, shouldConvertToZoglin, ZOMBIFY_TICKS } from './hoglin_zombify';

describe('hoglin zombify', () => {
  it('accumulates in overworld', () => {
    expect(tickZombify({ inOverworld: true, zombifyingTicks: 5 }).zombifyingTicks).toBe(6);
  });

  it('resets in nether', () => {
    expect(tickZombify({ inOverworld: false, zombifyingTicks: 100 }).zombifyingTicks).toBe(0);
  });

  it('converts at threshold', () => {
    expect(shouldConvertToZoglin({ inOverworld: true, zombifyingTicks: ZOMBIFY_TICKS })).toBe(true);
  });

  it('no convert early', () => {
    expect(shouldConvertToZoglin({ inOverworld: true, zombifyingTicks: 100 })).toBe(false);
  });

  it('no convert in nether', () => {
    expect(shouldConvertToZoglin({ inOverworld: false, zombifyingTicks: ZOMBIFY_TICKS })).toBe(
      false,
    );
  });
});
