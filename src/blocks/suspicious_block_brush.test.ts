import { describe, it, expect } from 'vitest';
import {
  canBrush,
  progressFraction,
  completesThisTick,
  BRUSH_TOTAL_TICKS,
} from './suspicious_block_brush';

describe('suspicious block brush', () => {
  const base = { brushingTicks: 0, hitBlock: 'suspicious_sand', hasBrush: true };

  it('can brush with tool + target', () => {
    expect(canBrush(base)).toBe(true);
  });

  it('cannot brush stone', () => {
    expect(canBrush({ ...base, hitBlock: 'stone' })).toBe(false);
  });

  it('no brush tool fails', () => {
    expect(canBrush({ ...base, hasBrush: false })).toBe(false);
  });

  it('progress clamps', () => {
    expect(progressFraction({ ...base, brushingTicks: 100 })).toBe(1);
  });

  it('completes at total', () => {
    expect(completesThisTick({ ...base, brushingTicks: BRUSH_TOTAL_TICKS })).toBe(true);
  });
});
