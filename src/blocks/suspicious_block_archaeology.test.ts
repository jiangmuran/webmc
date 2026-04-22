import { describe, it, expect } from 'vitest';
import {
  makeSuspicious,
  brush,
  STROKES_REQUIRED,
  INTERRUPT_MS,
  SUSPICIOUS_SAND_LOOT,
  SUSPICIOUS_GRAVEL_LOOT,
} from './suspicious_block_archaeology';

describe('archaeology', () => {
  it('brushing reaches reveal', () => {
    const b = makeSuspicious('suspicious_sand', 'webmc:diamond');
    let r = { revealed: false, progress: 0 };
    for (let i = 0; i < STROKES_REQUIRED; i++) r = brush(b, { nowMs: i * 100 });
    expect(r.revealed).toBe(true);
  });

  it('interrupt resets', () => {
    const b = makeSuspicious('suspicious_sand', 'webmc:diamond');
    brush(b, { nowMs: 0 });
    brush(b, { nowMs: 100 });
    brush(b, { nowMs: 100 + INTERRUPT_MS + 1 });
    expect(b.brushStrokes).toBe(1);
  });

  it('loot tables defined', () => {
    expect(SUSPICIOUS_SAND_LOOT.length).toBeGreaterThan(0);
    expect(SUSPICIOUS_GRAVEL_LOOT.length).toBeGreaterThan(0);
  });
});
