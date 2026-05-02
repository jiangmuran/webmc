import { describe, it, expect } from 'vitest';
import { canSpawn, isNight, INSOMNIA_THRESHOLD } from './phantom_spawn_condition';

describe('phantom spawn condition', () => {
  it('night detection', () => {
    expect(isNight(14000)).toBe(true);
    expect(isNight(6000)).toBe(false);
  });

  it('spawns at midnight with insomnia', () => {
    expect(
      canSpawn({
        playerInsomniaTicks: INSOMNIA_THRESHOLD,
        skyVisible: true,
        timeOfDay: 18000,
        lightLevel: 0,
      }),
    ).toBe(true);
  });

  it('covered blocks spawn', () => {
    expect(
      canSpawn({
        playerInsomniaTicks: INSOMNIA_THRESHOLD,
        skyVisible: false,
        timeOfDay: 18000,
        lightLevel: 0,
      }),
    ).toBe(false);
  });

  it('day no spawn', () => {
    expect(
      canSpawn({
        playerInsomniaTicks: INSOMNIA_THRESHOLD,
        skyVisible: true,
        timeOfDay: 6000,
        lightLevel: 0,
      }),
    ).toBe(false);
  });

  it('JE has no light-level gate (wiki — light is Bedrock-only)', () => {
    // minecraft.wiki/w/Phantom: JE spawn only requires sky visibility
    // and night, no light check. A torch-lit rooftop should still
    // spawn phantoms in JE.
    expect(
      canSpawn({
        playerInsomniaTicks: INSOMNIA_THRESHOLD,
        skyVisible: true,
        timeOfDay: 18000,
        lightLevel: 15, // bright — would block on Bedrock, fine on JE
      }),
    ).toBe(true);
  });
});
