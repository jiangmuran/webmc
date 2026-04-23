import { describe, it, expect } from 'vitest';
import {
  targetFrameMs,
  shouldPauseRender,
  maxRenderDistanceChunks,
  DESKTOP_FRAME_MS,
  BASE_FRAME_MS,
} from './power_budget';

describe('power budget', () => {
  it('desktop always 16.6', () => {
    expect(
      targetFrameMs({ batteryLevel: 0.1, charging: false, thermalState: 'critical' }, true),
    ).toBe(DESKTOP_FRAME_MS);
  });

  it('mobile nominal 30fps', () => {
    expect(targetFrameMs({ batteryLevel: 1, charging: true, thermalState: 'nominal' }, false)).toBe(
      BASE_FRAME_MS,
    );
  });

  it('throttle when hot', () => {
    expect(
      targetFrameMs({ batteryLevel: 1, charging: true, thermalState: 'serious' }, false),
    ).toBeGreaterThan(BASE_FRAME_MS);
  });

  it('pause when dead', () => {
    expect(
      shouldPauseRender({ batteryLevel: 0.02, charging: false, thermalState: 'nominal' }),
    ).toBe(true);
  });

  it('render distance scales', () => {
    expect(
      maxRenderDistanceChunks({ batteryLevel: 1, charging: true, thermalState: 'critical' }, false),
    ).toBe(2);
    expect(
      maxRenderDistanceChunks({ batteryLevel: 1, charging: true, thermalState: 'nominal' }, false),
    ).toBe(4);
  });
});
