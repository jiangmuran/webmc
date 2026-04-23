import { describe, it, expect } from 'vitest';
import {
  shouldSnapshot,
  expectedNextSnapshotMs,
  BASE_INTERVAL_MS,
  MIN_BYTES_TO_FORCE,
} from './snapshot_frequency_throttle';

describe('snapshot frequency throttle', () => {
  it('no pending no snapshot', () => {
    expect(shouldSnapshot({ lastSnapshotMs: 0, pendingBytes: 0, nowMs: 10000 })).toBe(false);
  });

  it('pending + interval triggers', () => {
    expect(shouldSnapshot({ lastSnapshotMs: 0, pendingBytes: 1000, nowMs: BASE_INTERVAL_MS })).toBe(
      true,
    );
  });

  it('early return false', () => {
    expect(shouldSnapshot({ lastSnapshotMs: 0, pendingBytes: 1000, nowMs: 100 })).toBe(false);
  });

  it('big backlog forces immediate', () => {
    expect(shouldSnapshot({ lastSnapshotMs: 0, pendingBytes: MIN_BYTES_TO_FORCE, nowMs: 0 })).toBe(
      true,
    );
  });

  it('bigger backlog → earlier next', () => {
    const slow = expectedNextSnapshotMs(0, 100);
    const fast = expectedNextSnapshotMs(0, MIN_BYTES_TO_FORCE);
    expect(fast).toBeLessThan(slow);
  });
});
