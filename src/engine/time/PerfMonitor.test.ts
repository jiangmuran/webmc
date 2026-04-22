import { describe, it, expect } from 'vitest';
import { PerfMonitor } from './PerfMonitor';

function feed(m: PerfMonitor, ms: number, seconds: number): number {
  // Feed `seconds/ms`-many frames, each at dt = ms.
  let changes = 0;
  const dtSec = ms / 1000;
  const frames = Math.floor(seconds / dtSec);
  for (let i = 0; i < frames; i++) if (m.tick(dtSec)) changes++;
  return changes;
}

describe('PerfMonitor', () => {
  it('starts at startQuality', () => {
    const m = new PerfMonitor({ startQuality: 8 });
    expect(m.quality).toBe(8);
  });

  it('does not change quality during warm-up (under holdSec)', () => {
    const m = new PerfMonitor({
      windowSec: 3,
      holdSec: 2,
      upShiftThresholdSec: 0.033,
      downShiftThresholdSec: 0.022,
      startQuality: 6,
      minQuality: 2,
      maxQuality: 10,
    });
    const changes = feed(m, 50, 1); // 50 ms frames for 1s — bad, but only 1s
    expect(changes).toBe(0);
    expect(m.quality).toBe(6);
  });

  it('drops quality after sustained high frame time', () => {
    const m = new PerfMonitor({
      windowSec: 3,
      holdSec: 2,
      upShiftThresholdSec: 0.033,
      downShiftThresholdSec: 0.022,
      startQuality: 6,
      minQuality: 2,
      maxQuality: 10,
    });
    feed(m, 50, 5); // 50 ms/frame (= 20 FPS) for 5 seconds
    expect(m.quality).toBeLessThan(6);
  });

  it('raises quality after sustained low frame time', () => {
    const m = new PerfMonitor({
      windowSec: 3,
      holdSec: 2,
      upShiftThresholdSec: 0.033,
      downShiftThresholdSec: 0.022,
      startQuality: 4,
      minQuality: 2,
      maxQuality: 10,
    });
    feed(m, 12, 5); // 12 ms/frame (~80 FPS) for 5 seconds
    expect(m.quality).toBeGreaterThan(4);
  });

  it('stays put in the dead zone between thresholds', () => {
    const m = new PerfMonitor({
      windowSec: 3,
      holdSec: 2,
      upShiftThresholdSec: 0.033,
      downShiftThresholdSec: 0.022,
      startQuality: 6,
      minQuality: 2,
      maxQuality: 10,
    });
    feed(m, 28, 6); // 28 ms/frame — between 22 and 33
    expect(m.quality).toBe(6);
  });

  it('respects minQuality floor', () => {
    const m = new PerfMonitor({
      windowSec: 3,
      holdSec: 1,
      upShiftThresholdSec: 0.033,
      downShiftThresholdSec: 0.022,
      startQuality: 3,
      minQuality: 2,
      maxQuality: 10,
    });
    feed(m, 100, 20); // terrible frames for a long time
    expect(m.quality).toBeGreaterThanOrEqual(2);
  });

  it('p95 reflects recent samples', () => {
    const m = new PerfMonitor({ windowSec: 3 });
    for (let i = 0; i < 80; i++) m.tick(0.016);
    for (let i = 0; i < 20; i++) m.tick(0.5); // 20% awful frames
    expect(m.p95()).toBeGreaterThan(0.016);
  });

  it('reset clears state', () => {
    const m = new PerfMonitor();
    m.tick(0.05);
    m.reset();
    expect(m.p95()).toBe(0);
  });
});
