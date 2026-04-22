import { describe, it, expect } from 'vitest';
import {
  makePingTracker,
  onSent,
  onReceived,
  avgRtt,
  packetLossFraction,
  classifyConnection,
} from './server_ping_probe';

describe('ping probe', () => {
  it('avg rtt', () => {
    const p = makePingTracker();
    onSent(p);
    onReceived(p, 50);
    onSent(p);
    onReceived(p, 100);
    expect(avgRtt(p)).toBe(75);
  });

  it('packet loss', () => {
    const p = makePingTracker();
    for (let i = 0; i < 10; i++) onSent(p);
    for (let i = 0; i < 8; i++) onReceived(p, 50);
    expect(packetLossFraction(p)).toBeCloseTo(0.2);
  });

  it('classify excellent', () => {
    const p = makePingTracker();
    onSent(p);
    onReceived(p, 30);
    expect(classifyConnection(p)).toBe('excellent');
  });

  it('high loss unusable', () => {
    const p = makePingTracker();
    for (let i = 0; i < 10; i++) onSent(p);
    for (let i = 0; i < 5; i++) onReceived(p, 50);
    expect(classifyConnection(p)).toBe('unusable');
  });

  it('maxSamples cap', () => {
    const p = makePingTracker(3);
    for (let i = 0; i < 5; i++) {
      onSent(p);
      onReceived(p, i * 10);
    }
    expect(p.rttSamples.length).toBe(3);
  });
});
