import { describe, it, expect } from 'vitest';
import { dayCount, timeInDay, phaseOfDay, formatDayTime } from './time_format_day_count';

describe('time format day count', () => {
  it('tick 0 = day 0', () => {
    expect(dayCount(0)).toBe(0);
  });

  it('24000 = day 1', () => {
    expect(dayCount(24000)).toBe(1);
  });

  it('in-day wraps', () => {
    expect(timeInDay(24001)).toBe(1);
  });

  it('phases', () => {
    expect(phaseOfDay(500)).toBe('dawn');
    expect(phaseOfDay(6000)).toBe('day');
    expect(phaseOfDay(12500)).toBe('dusk');
    expect(phaseOfDay(18000)).toBe('night');
  });

  it('format includes colon', () => {
    expect(formatDayTime(6000)).toContain(':');
  });
});
