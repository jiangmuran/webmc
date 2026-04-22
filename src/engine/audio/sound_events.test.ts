import { describe, it, expect } from 'vitest';
import { SOUND_EVENTS, pickPitch, soundFor } from './sound_events';

describe('sound events', () => {
  it('has 20+ event definitions', () => {
    expect(Object.keys(SOUND_EVENTS).length).toBeGreaterThanOrEqual(20);
  });

  it('soundFor returns null for unknown events', () => {
    expect(soundFor('not.a.real.event')).toBeNull();
  });

  it('pitch range sanity: min ≤ max for every event', () => {
    for (const [event, def] of Object.entries(SOUND_EVENTS)) {
      expect(def.pitchMin, event).toBeLessThanOrEqual(def.pitchMax);
    }
  });

  it('pickPitch falls inside the range', () => {
    const p1 = pickPitch('block.break', () => 0);
    const p2 = pickPitch('block.break', () => 1);
    const def = soundFor('block.break');
    if (!def) throw new Error('missing block.break');
    expect(p1).toBeGreaterThanOrEqual(def.pitchMin);
    expect(p2).toBeLessThanOrEqual(def.pitchMax);
  });

  it('pickPitch defaults to 1 for unknown events', () => {
    expect(pickPitch('unknown.event', () => 0.5)).toBe(1);
  });
});
