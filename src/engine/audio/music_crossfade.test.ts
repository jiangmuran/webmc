import { describe, it, expect } from 'vitest';
import {
  startTransition,
  updateProgress,
  fromVolume,
  toVolume,
  finished,
  CROSSFADE_DURATION_MS,
} from './music_crossfade';

describe('music crossfade', () => {
  it('starts at 0', () => {
    expect(startTransition('a', 'b', 0).progress01).toBe(0);
  });

  it('halfway through', () => {
    const t = updateProgress(startTransition('a', 'b', 0), CROSSFADE_DURATION_MS / 2);
    expect(t.progress01).toBeCloseTo(0.5);
  });

  it('finishes at full duration', () => {
    const t = updateProgress(startTransition('a', 'b', 0), CROSSFADE_DURATION_MS);
    expect(finished(t)).toBe(true);
  });

  it('volumes sum to 1', () => {
    const t = updateProgress(startTransition('a', 'b', 0), CROSSFADE_DURATION_MS / 3);
    expect(fromVolume(t) + toVolume(t)).toBeCloseTo(1);
  });

  it('past duration clamps', () => {
    const t = updateProgress(startTransition('a', 'b', 0), CROSSFADE_DURATION_MS * 10);
    expect(t.progress01).toBe(1);
  });
});
