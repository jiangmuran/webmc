import { describe, it, expect } from 'vitest';
import {
  signalStrength,
  boostsArrow,
  signalFades,
  SIGNAL_DURATION_TICKS_ARROW,
  SIGNAL_DURATION_TICKS_THROWABLE,
} from './target_block_hit';

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

  it('arrow signal lasts 20 ticks (wiki)', () => {
    // Wiki (minecraft.wiki/w/Target): arrows + tridents → 20 gt.
    expect(SIGNAL_DURATION_TICKS_ARROW).toBe(20);
    expect(signalFades(19, 0, 'arrow')).toBe(false);
    expect(signalFades(20, 0, 'arrow')).toBe(true);
  });

  it('throwable signal lasts 8 ticks (wiki)', () => {
    // Wiki (minecraft.wiki/w/Target): "most projectiles" → 8 gt.
    expect(SIGNAL_DURATION_TICKS_THROWABLE).toBe(8);
    expect(signalFades(7, 0, 'throwable')).toBe(false);
    expect(signalFades(8, 0, 'throwable')).toBe(true);
  });
});
