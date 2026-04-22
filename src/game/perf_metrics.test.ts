import { describe, it, expect } from 'vitest';
import { RollingMetric, updateThrottle } from './perf_metrics';

describe('rolling metric', () => {
  it('quantiles', () => {
    const m = new RollingMetric(100);
    for (let i = 1; i <= 100; i++) m.push(i);
    expect(m.p50()).toBe(51);
    expect(m.p95()).toBe(96);
    expect(m.p99()).toBe(100);
  });

  it('capacity drops oldest', () => {
    const m = new RollingMetric(3);
    m.push(1);
    m.push(2);
    m.push(3);
    m.push(100);
    expect(m.count()).toBe(3);
    expect(m.p95()).toBe(100);
  });

  it('reset', () => {
    const m = new RollingMetric();
    m.push(5);
    m.reset();
    expect(m.count()).toBe(0);
  });
});

describe('throttle', () => {
  it('under limit = ok', () => {
    const s = { breachStartMs: null as number | null };
    expect(updateThrottle(s, 10, 33, 3000, 1000)).toBe('ok');
  });

  it('sustained breach steps down', () => {
    const s = { breachStartMs: null as number | null };
    expect(updateThrottle(s, 40, 33, 3000, 1000)).toBe('ok'); // breach starts
    expect(updateThrottle(s, 40, 33, 3000, 2000)).toBe('ok'); // still breach
    expect(updateThrottle(s, 40, 33, 3000, 4500)).toBe('step_down');
  });

  it('recovery resets', () => {
    const s = { breachStartMs: null as number | null };
    updateThrottle(s, 40, 33, 3000, 1000);
    updateThrottle(s, 10, 33, 3000, 2000);
    expect(s.breachStartMs).toBeNull();
  });
});
