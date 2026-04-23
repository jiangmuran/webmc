import { describe, it, expect } from 'vitest';
import { shouldZombify, shakeTimeTicks, ZOMBIFY_TIME_TICKS } from './piglin_zombify';

describe('piglin zombify', () => {
  it('overworld after 300t', () => {
    expect(
      shouldZombify({
        spawnTick: 0,
        nowTick: ZOMBIFY_TIME_TICKS,
        dimension: 'overworld',
        convertedFromShake: false,
      }),
    ).toBe(true);
  });

  it('still in shake window', () => {
    expect(
      shouldZombify({
        spawnTick: 0,
        nowTick: 100,
        dimension: 'overworld',
        convertedFromShake: false,
      }),
    ).toBe(false);
  });

  it('nether no zombify', () => {
    expect(
      shouldZombify({
        spawnTick: 0,
        nowTick: 10000,
        dimension: 'nether',
        convertedFromShake: false,
      }),
    ).toBe(false);
  });

  it('shake flag forces zombify', () => {
    expect(
      shouldZombify({
        spawnTick: 0,
        nowTick: 0,
        dimension: 'overworld',
        convertedFromShake: true,
      }),
    ).toBe(true);
  });

  it('shake time positive', () => {
    expect(shakeTimeTicks()).toBeGreaterThan(0);
  });
});
