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
});
