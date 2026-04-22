import { describe, it, expect } from 'vitest';
import { makeDjState, onContextChange, tickDj, type MusicTrack } from './music_dj';

const LIBRARY: MusicTrack[] = [
  { id: 'calm_1', contexts: ['overworld_day'], durationSec: 60, minGapSec: 600 },
  { id: 'creative_1', contexts: ['creative'], durationSec: 120, minGapSec: 300 },
  { id: 'nether_1', contexts: ['nether'], durationSec: 80, minGapSec: 300 },
];

describe('music DJ', () => {
  it('picks a context track', () => {
    const s = makeDjState();
    const r = tickDj(s, {
      context: 'overworld_day',
      nowSec: 0,
      rng: () => 0,
      library: LIBRARY,
    });
    expect(r.startTrackId).toBe('calm_1');
  });

  it('no tracks for context = null', () => {
    const s = makeDjState();
    const r = tickDj(s, {
      context: 'end_dragon_fight',
      nowSec: 0,
      rng: () => 0,
      library: LIBRARY,
    });
    expect(r.startTrackId).toBeNull();
  });

  it('respects minGap', () => {
    const s = makeDjState();
    tickDj(s, { context: 'overworld_day', nowSec: 0, rng: () => 0, library: LIBRARY });
    // try again before nextTrack time — should be silent
    const r = tickDj(s, {
      context: 'overworld_day',
      nowSec: 30,
      rng: () => 0,
      library: LIBRARY,
    });
    expect(r.startTrackId).toBeNull();
  });

  it('context change fades out', () => {
    const s = makeDjState();
    tickDj(s, { context: 'overworld_day', nowSec: 0, rng: () => 0, library: LIBRARY });
    const r = onContextChange(s, {
      context: 'nether',
      nowSec: 5,
      rng: () => 0,
      library: LIBRARY,
    });
    expect(r.fadeOutCurrent).toBe(true);
  });
});
