import { describe, it, expect } from 'vitest';
import { crackStage, makeBreakProgressState, updateBreakProgress } from './block_break_progress';

describe('block break progress', () => {
  it('no target = zero progress', () => {
    const s = makeBreakProgressState();
    const r = updateBreakProgress(s, {
      target: null,
      holding: true,
      breakTimeSec: 1,
      dtSec: 0.5,
    });
    expect(r.fraction).toBe(0);
  });

  it('accumulates over ticks', () => {
    const s = makeBreakProgressState();
    const t = { x: 0, y: 0, z: 0 };
    const r = updateBreakProgress(s, {
      target: t,
      holding: true,
      breakTimeSec: 1,
      dtSec: 0.3,
    });
    expect(r.fraction).toBeCloseTo(0.3);
  });

  it('instant break when breakTime <= 0', () => {
    const s = makeBreakProgressState();
    const t = { x: 0, y: 0, z: 0 };
    const r = updateBreakProgress(s, {
      target: t,
      holding: true,
      breakTimeSec: 0,
      dtSec: 0.1,
    });
    expect(r.broken).toBe(true);
  });

  it('reaching 1 breaks the block', () => {
    const s = makeBreakProgressState();
    const t = { x: 0, y: 0, z: 0 };
    updateBreakProgress(s, { target: t, holding: true, breakTimeSec: 1, dtSec: 0.9 });
    const r = updateBreakProgress(s, {
      target: t,
      holding: true,
      breakTimeSec: 1,
      dtSec: 0.2,
    });
    expect(r.broken).toBe(true);
    expect(s.progress).toBe(0);
  });

  it('target change resets progress', () => {
    const s = makeBreakProgressState();
    updateBreakProgress(s, {
      target: { x: 0, y: 0, z: 0 },
      holding: true,
      breakTimeSec: 2,
      dtSec: 1,
    });
    const r = updateBreakProgress(s, {
      target: { x: 1, y: 0, z: 0 },
      holding: true,
      breakTimeSec: 2,
      dtSec: 0.1,
    });
    expect(r.fraction).toBeLessThan(0.1);
  });

  it('release clears progress', () => {
    const s = makeBreakProgressState();
    updateBreakProgress(s, {
      target: { x: 0, y: 0, z: 0 },
      holding: true,
      breakTimeSec: 2,
      dtSec: 1,
    });
    updateBreakProgress(s, {
      target: { x: 0, y: 0, z: 0 },
      holding: false,
      breakTimeSec: 2,
      dtSec: 0.1,
    });
    expect(s.target).toBeNull();
  });

  it('crack stage maps 0..1 to 0..9', () => {
    expect(crackStage(0)).toBe(0);
    expect(crackStage(0.5)).toBe(5);
    expect(crackStage(1)).toBe(9);
  });
});
