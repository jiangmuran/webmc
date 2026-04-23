import { describe, it, expect } from 'vitest';
import { shouldEvictForNew, MAX_CONCURRENT, type SoundInstance } from './sound_priority_eviction';

function mk(i: number, priority = 1, volume = 1): SoundInstance {
  return {
    id: `s${i}`,
    priority,
    volume,
    startedAtMs: i * 100,
    isPositional: false,
  };
}

describe('sound priority eviction', () => {
  it('room when not full', () => {
    expect(shouldEvictForNew([mk(0)], 1).ok).toBe(true);
  });

  it('full rejects lower-priority incoming', () => {
    const full = Array.from({ length: MAX_CONCURRENT }, (_, i) => mk(i, 5));
    expect(shouldEvictForNew(full, 1).ok).toBe(false);
  });

  it('higher priority evicts lowest', () => {
    const full = Array.from({ length: MAX_CONCURRENT }, (_, i) => mk(i, 2));
    const withLow = [mk(99, 0), ...full.slice(1)];
    const r = shouldEvictForNew(withLow, 5);
    expect(r.ok).toBe(true);
    expect(r.evict?.priority).toBe(0);
  });

  it('tie prefers lower volume evict', () => {
    const full = [
      ...Array.from({ length: MAX_CONCURRENT - 1 }, (_, i) => mk(i, 3, 1)),
      mk(99, 3, 0.1),
    ];
    const r = shouldEvictForNew(full, 5);
    expect(r.evict?.id).toBe('s99');
  });
});
