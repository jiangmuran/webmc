import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { FrameTimer } from './FrameTimer';

describe('FrameTimer', () => {
  let now = 0;

  beforeEach(() => {
    now = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => now);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns fps=0 on the first tick', () => {
    const t = new FrameTimer();
    now = 16;
    const s = t.tick();
    expect(s.fps).toBe(0);
    expect(s.frameMs).toBeCloseTo(16, 5);
  });

  it('computes fps after accumulating ≥500ms', () => {
    const t = new FrameTimer();
    for (let i = 0; i < 30; i++) {
      now += 16.67;
      t.tick();
    }
    const s = t.tick();
    expect(s.fps).toBeGreaterThan(55);
    expect(s.fps).toBeLessThan(65);
  });

  it('resets state cleanly', () => {
    const t = new FrameTimer();
    for (let i = 0; i < 30; i++) {
      now += 16.67;
      t.tick();
    }
    t.reset();
    now += 16.67;
    const s = t.tick();
    expect(s.fps).toBe(0);
  });

  it('clamps frameMs on tab-suspend-sized gaps', () => {
    const t = new FrameTimer();
    now = 16;
    t.tick();
    now += 5_000_000;
    const s = t.tick();
    expect(s.frameMs).toBeLessThanOrEqual(100);
  });

  it('treats non-monotonic time as a zero-length frame', () => {
    const t = new FrameTimer();
    now = 100;
    t.tick();
    now = 50;
    const s = t.tick();
    expect(s.frameMs).toBe(0);
  });
});
