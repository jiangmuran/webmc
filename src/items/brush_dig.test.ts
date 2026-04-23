import { describe, it, expect } from 'vitest';
import { onBrushTick, onBrushStop, isComplete, stage, BRUSH_DUSTING_TICKS } from './brush_dig';

describe('brush dig', () => {
  it('progress advances', () => {
    const s = onBrushTick({ progressTicks: 0, maxTicks: BRUSH_DUSTING_TICKS });
    expect(s.progressTicks).toBe(1);
  });

  it('caps at max', () => {
    expect(
      onBrushTick({ progressTicks: BRUSH_DUSTING_TICKS, maxTicks: BRUSH_DUSTING_TICKS })
        .progressTicks,
    ).toBe(BRUSH_DUSTING_TICKS);
  });

  it('stop resets', () => {
    expect(onBrushStop({ progressTicks: 30, maxTicks: BRUSH_DUSTING_TICKS }).progressTicks).toBe(0);
  });

  it('complete threshold', () => {
    expect(isComplete({ progressTicks: BRUSH_DUSTING_TICKS, maxTicks: BRUSH_DUSTING_TICKS })).toBe(
      true,
    );
  });

  it('stage 0..3', () => {
    expect(stage({ progressTicks: 0, maxTicks: 100 })).toBe(0);
    expect(stage({ progressTicks: 30, maxTicks: 100 })).toBe(1);
    expect(stage({ progressTicks: 60, maxTicks: 100 })).toBe(2);
    expect(stage({ progressTicks: 90, maxTicks: 100 })).toBe(3);
  });
});
