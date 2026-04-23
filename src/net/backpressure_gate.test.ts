import { describe, it, expect } from 'vitest';
import {
  shouldPauseNonCritical,
  canResume,
  queueDepthHealth,
  DEFAULT_HIGH_WATERMARK,
  DEFAULT_LOW_WATERMARK,
} from './backpressure_gate';

describe('backpressure gate', () => {
  it('healthy low buffer', () => {
    expect(
      queueDepthHealth({
        bufferedAmount: 0,
        highWatermark: DEFAULT_HIGH_WATERMARK,
        lowWatermark: DEFAULT_LOW_WATERMARK,
      }),
    ).toBe('healthy');
  });

  it('critical at high watermark', () => {
    expect(
      shouldPauseNonCritical({
        bufferedAmount: DEFAULT_HIGH_WATERMARK + 1,
        highWatermark: DEFAULT_HIGH_WATERMARK,
        lowWatermark: DEFAULT_LOW_WATERMARK,
      }),
    ).toBe(true);
  });

  it('resume at low', () => {
    expect(
      canResume({
        bufferedAmount: DEFAULT_LOW_WATERMARK,
        highWatermark: DEFAULT_HIGH_WATERMARK,
        lowWatermark: DEFAULT_LOW_WATERMARK,
      }),
    ).toBe(true);
  });

  it('warning band', () => {
    expect(
      queueDepthHealth({
        bufferedAmount: DEFAULT_HIGH_WATERMARK * 0.6,
        highWatermark: DEFAULT_HIGH_WATERMARK,
        lowWatermark: DEFAULT_LOW_WATERMARK,
      }),
    ).toBe('warning');
  });
});
