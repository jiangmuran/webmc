import { describe, it, expect } from 'vitest';
import { signalStrength, boostsArrow, signalFades } from './target_block_hit';

describe('target block hit', () => {
  it('bullseye 15', () => {
    expect(signalStrength(0)).toBe(15);
  });

  it('edge 0', () => {
    expect(signalStrength(1)).toBe(0);
  });

  it('partial', () => {
    const s = signalStrength(0.5);
    expect(s).toBeGreaterThan(0);
    expect(s).toBeLessThan(15);
  });

  it('arrow boost', () => {
    expect(boostsArrow()).toBe(true);
  });

  it('signal fades', () => {
    expect(signalFades(10, 0)).toBe(true);
    expect(signalFades(3, 0)).toBe(false);
  });
});
