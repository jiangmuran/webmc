import { describe, it, expect } from 'vitest';
import {
  makeLoadProgress,
  overallFraction,
  advance,
  setProgress,
  WEIGHTS,
} from './loading_screen_steps';

describe('load progress', () => {
  it('starts at 0', () => {
    const lp = makeLoadProgress();
    expect(overallFraction(lp)).toBe(0);
  });

  it('step progress', () => {
    const lp = makeLoadProgress();
    setProgress(lp, 0.5);
    expect(overallFraction(lp)).toBeCloseTo(WEIGHTS.load_world * 0.5);
  });

  it('advance to next step', () => {
    const lp = makeLoadProgress();
    setProgress(lp, 1);
    advance(lp);
    expect(lp.step).toBe('stream_chunks');
    expect(lp.stepProgress).toBe(0);
    expect(overallFraction(lp)).toBeCloseTo(WEIGHTS.load_world);
  });

  it('done = 1', () => {
    const lp = makeLoadProgress();
    advance(lp);
    advance(lp);
    advance(lp);
    advance(lp);
    expect(overallFraction(lp)).toBe(1);
  });

  it('cannot advance past done', () => {
    const lp = { step: 'done' as const, stepProgress: 0 };
    expect(advance(lp)).toBe(false);
  });

  it('clamped step progress', () => {
    const lp = makeLoadProgress();
    setProgress(lp, 2);
    expect(lp.stepProgress).toBe(1);
    setProgress(lp, -1);
    expect(lp.stepProgress).toBe(0);
  });
});
