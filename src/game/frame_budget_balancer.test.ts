import { describe, it, expect } from 'vitest';
import { remaining, nextFrameBudget, qualityStep, type FrameBudget } from './frame_budget_balancer';

const base: FrameBudget = { targetMs: 16, usedMs: 10, carryoverMs: 0 };

describe('frame budget balancer', () => {
  it('positive remaining', () => {
    expect(remaining(base)).toBe(6);
  });

  it('overspend carries negative', () => {
    const over: FrameBudget = { targetMs: 16, usedMs: 32, carryoverMs: 0 };
    expect(nextFrameBudget(over).carryoverMs).toBeLessThan(0);
  });

  it('carryover bounded', () => {
    const skip: FrameBudget = { targetMs: 16, usedMs: 0, carryoverMs: 0 };
    expect(Math.abs(nextFrameBudget(skip).carryoverMs)).toBeLessThanOrEqual(16);
  });

  it('low fps steps down', () => {
    expect(qualityStep(10)).toBe('down');
  });

  it('high fps steps up', () => {
    expect(qualityStep(60)).toBe('up');
  });

  it('midrange holds', () => {
    expect(qualityStep(30)).toBe('hold');
  });
});
