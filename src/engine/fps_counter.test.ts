import { describe, it, expect } from 'vitest';
import { makeStats, onFrame, p95Fps, avgFps } from './fps_counter';

describe('fps counter', () => {
  it('initial empty stats', () => {
    const s = makeStats();
    expect(p95Fps(s)).toBe(0);
    expect(avgFps(s)).toBe(0);
  });

  it('60fps stable', () => {
    const s = makeStats();
    for (let i = 0; i < 100; i++) onFrame(s, 1000 / 60);
    expect(avgFps(s)).toBeCloseTo(60);
  });

  it('window trims old', () => {
    const s = makeStats(10);
    for (let i = 0; i < 50; i++) onFrame(s, 10);
    expect(s.samples.length).toBe(10);
  });

  it('p95 catches lowest', () => {
    const s = makeStats();
    for (let i = 0; i < 80; i++) onFrame(s, 1000 / 60);
    for (let i = 0; i < 20; i++) onFrame(s, 1000 / 10);
    expect(p95Fps(s)).toBeLessThan(avgFps(s));
  });
});
