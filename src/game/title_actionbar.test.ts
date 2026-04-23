import { describe, it, expect } from 'vitest';
import { totalTicks, alphaAt } from './title_actionbar';

const t = { title: 'Hi', fadeInTicks: 10, stayTicks: 70, fadeOutTicks: 20 };

describe('title actionbar', () => {
  it('total sum', () => {
    expect(totalTicks(t)).toBe(100);
  });

  it('zero alpha before', () => {
    expect(alphaAt(t, -5)).toBe(0);
  });

  it('fade in ramps', () => {
    expect(alphaAt(t, 5)).toBeCloseTo(0.5);
  });

  it('full alpha during stay', () => {
    expect(alphaAt(t, 40)).toBe(1);
  });

  it('fade out ramps down', () => {
    expect(alphaAt(t, 90)).toBeCloseTo(0.5);
  });

  it('zero after total', () => {
    expect(alphaAt(t, 101)).toBe(0);
  });
});
