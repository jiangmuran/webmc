import { describe, it, expect } from 'vitest';
import { nextStage, prevStage, tryProgress, scrapeAxe, wax } from './copper_aging_stages';

describe('copper aging', () => {
  it('next/prev', () => {
    expect(nextStage('unoxidized')).toBe('exposed');
    expect(nextStage('oxidized')).toBeNull();
    expect(prevStage('unoxidized')).toBeNull();
  });

  it('progress advances', () => {
    const b = { stage: 'unoxidized' as const, waxed: false };
    expect(tryProgress(b, { rand: () => 0, adjacentHigherStage: true })).toBe(true);
    expect(b.stage).toBe('exposed');
  });

  it('waxed blocks progress', () => {
    const b = { stage: 'unoxidized' as const, waxed: true };
    expect(tryProgress(b, { rand: () => 0, adjacentHigherStage: true })).toBe(false);
  });

  it('oxidized doesnt advance', () => {
    const b = { stage: 'oxidized' as const, waxed: false };
    expect(tryProgress(b, { rand: () => 0, adjacentHigherStage: false })).toBe(false);
  });

  it('axe scrapes', () => {
    const b = { stage: 'exposed' as const, waxed: false };
    expect(scrapeAxe(b)).toBe(true);
    expect(b.stage).toBe('unoxidized');
  });

  it('axe removes wax first', () => {
    const b = { stage: 'exposed' as const, waxed: true };
    scrapeAxe(b);
    expect(b.waxed).toBe(false);
    expect(b.stage).toBe('exposed');
  });

  it('wax once', () => {
    const b = { stage: 'unoxidized' as const, waxed: false };
    expect(wax(b)).toBe(true);
    expect(wax(b)).toBe(false);
  });

  it('progress chance is 64/1125 with neighbor (wiki)', () => {
    const b = { stage: 'unoxidized' as const, waxed: false };
    // 0.05 < 64/1125 (≈0.0569) → progresses
    expect(tryProgress(b, { rand: () => 0.05, adjacentHigherStage: true })).toBe(true);
    const b2 = { stage: 'unoxidized' as const, waxed: false };
    // 0.06 > 64/1125 → no
    expect(tryProgress(b2, { rand: () => 0.06, adjacentHigherStage: true })).toBe(false);
  });

  it('progress chance is 64/1125 × 0.75 isolated (wiki)', () => {
    const b = { stage: 'unoxidized' as const, waxed: false };
    // 0.04 < 0.0427 → progress
    expect(tryProgress(b, { rand: () => 0.04, adjacentHigherStage: false })).toBe(true);
    const b2 = { stage: 'unoxidized' as const, waxed: false };
    // 0.05 > 0.0427 → no progress (but would progress with neighbor)
    expect(tryProgress(b2, { rand: () => 0.05, adjacentHigherStage: false })).toBe(false);
  });
});
