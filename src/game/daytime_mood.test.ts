import { describe, it, expect } from 'vitest';
import { makeMoodState, tickMood, MOOD_THRESHOLD_MS } from './daytime_mood';

describe('mood timer', () => {
  it('builds in darkness, triggers at threshold', () => {
    const s = makeMoodState();
    const r1 = tickMood(s, { skyLight: 0, blockLight: 0, dtMs: MOOD_THRESHOLD_MS - 100 });
    expect(r1.triggered).toBe(false);
    const r2 = tickMood(s, { skyLight: 0, blockLight: 0, dtMs: 200 });
    expect(r2.triggered).toBe(true);
    expect(s.moodMs).toBe(0);
  });

  it('light drains mood', () => {
    const s = makeMoodState();
    tickMood(s, { skyLight: 0, blockLight: 0, dtMs: 1000 });
    tickMood(s, { skyLight: 15, blockLight: 0, dtMs: 2000 });
    expect(s.moodMs).toBe(0);
  });

  it('never triggers in bright light', () => {
    const s = makeMoodState();
    for (let i = 0; i < 100; i++) {
      const r = tickMood(s, { skyLight: 15, blockLight: 15, dtMs: 1000 });
      expect(r.triggered).toBe(false);
    }
  });
});
