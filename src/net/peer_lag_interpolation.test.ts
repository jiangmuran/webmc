import { describe, it, expect } from 'vitest';
import {
  recommendedInterpDelay,
  connectionQuality,
  snapshotIntervalForQuality,
  MIN_INTERP_DELAY,
  MAX_INTERP_DELAY,
} from './peer_lag_interpolation';

describe('peer lag interpolation', () => {
  it('low rtt hits floor', () => {
    expect(recommendedInterpDelay({ rttMs: 10, jitterMs: 0, packetLoss: 0 })).toBe(
      MIN_INTERP_DELAY,
    );
  });

  it('extreme rtt caps', () => {
    expect(recommendedInterpDelay({ rttMs: 10000, jitterMs: 0, packetLoss: 0 })).toBe(
      MAX_INTERP_DELAY,
    );
  });

  it('jitter adds', () => {
    const smooth = recommendedInterpDelay({ rttMs: 200, jitterMs: 0, packetLoss: 0 });
    const jitter = recommendedInterpDelay({ rttMs: 200, jitterMs: 50, packetLoss: 0 });
    expect(jitter).toBeGreaterThan(smooth);
  });

  it('quality excellent', () => {
    expect(connectionQuality({ rttMs: 30, jitterMs: 5, packetLoss: 0 })).toBe('excellent');
  });

  it('quality poor', () => {
    expect(connectionQuality({ rttMs: 500, jitterMs: 50, packetLoss: 0.2 })).toBe('poor');
  });

  it('interval scales with quality', () => {
    expect(snapshotIntervalForQuality('excellent')).toBeLessThan(
      snapshotIntervalForQuality('poor'),
    );
  });
});
