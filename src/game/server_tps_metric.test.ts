import { describe, it, expect } from 'vitest';
import { TpsTracker } from './server_tps_metric';

describe('tps tracker', () => {
  it('ideal = 20', () => {
    const t = new TpsTracker();
    t.pushMspt(50);
    expect(t.tps()).toBe(20);
  });

  it('slow ticks drop tps', () => {
    const t = new TpsTracker();
    for (let i = 0; i < 10; i++) t.pushMspt(100);
    expect(t.tps()).toBe(10);
  });

  it('p95 higher than p50', () => {
    const t = new TpsTracker();
    for (let i = 0; i < 100; i++) t.pushMspt(i);
    expect(t.percentile(0.95)).toBeGreaterThan(t.percentile(0.5));
  });

  it('lag detection', () => {
    const t = new TpsTracker();
    for (let i = 0; i < 10; i++) t.pushMspt(80);
    expect(t.isLagging()).toBe(true);
  });

  it('empty', () => {
    expect(new TpsTracker().tps()).toBe(20);
  });
});
