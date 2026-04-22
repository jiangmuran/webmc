// Ambient "mood" sound scheduler. In MC, when a nearby cave is dark
// enough for mob spawning, a mood timer builds up and eventually plays
// a random cave sound. We expose a deterministic tick function.

export interface MoodState {
  moodMs: number; // 0..MOOD_THRESHOLD_MS
}

export const MOOD_THRESHOLD_MS = 6000;

export function makeMoodState(): MoodState {
  return { moodMs: 0 };
}

export interface MoodTick {
  skyLight: number; // 0..15
  blockLight: number; // 0..15
  dtMs: number;
}

// Mood builds when a nearby eligible block is dark (light < 8) and not
// in direct skylight.
export function tickMood(state: MoodState, q: MoodTick): { triggered: boolean } {
  const maxLight = Math.max(q.skyLight, q.blockLight);
  if (maxLight < 8) {
    state.moodMs += q.dtMs;
  } else {
    state.moodMs = Math.max(0, state.moodMs - q.dtMs);
  }
  if (state.moodMs >= MOOD_THRESHOLD_MS) {
    state.moodMs = 0;
    return { triggered: true };
  }
  return { triggered: false };
}
