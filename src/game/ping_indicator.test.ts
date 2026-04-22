import { describe, it, expect } from 'vitest';
import { predictionHorizonTicks, signalFor } from './ping_indicator';

describe('ping indicator', () => {
  it('offline shows 0 bars', () => {
    expect(signalFor({ smoothedRttMs: 0, p95RttMs: 0, packetLossFraction: 0 }).bars).toBe(0);
  });

  it('local 10ms = excellent', () => {
    expect(signalFor({ smoothedRttMs: 10, p95RttMs: 20, packetLossFraction: 0 }).bars).toBe(5);
  });

  it('200ms + 5% loss = poor', () => {
    expect(signalFor({ smoothedRttMs: 200, p95RttMs: 400, packetLossFraction: 0.05 }).bars).toBe(2);
  });

  it('500ms = bad', () => {
    expect(signalFor({ smoothedRttMs: 500, p95RttMs: 800, packetLossFraction: 0 }).bars).toBe(1);
  });

  it('prediction horizon grows with latency', () => {
    expect(predictionHorizonTicks({ smoothedRttMs: 0, p95RttMs: 50, packetLossFraction: 0 })).toBe(
      1,
    );
    expect(predictionHorizonTicks({ smoothedRttMs: 0, p95RttMs: 150, packetLossFraction: 0 })).toBe(
      2,
    );
    expect(predictionHorizonTicks({ smoothedRttMs: 0, p95RttMs: 500, packetLossFraction: 0 })).toBe(
      6,
    );
  });
});
