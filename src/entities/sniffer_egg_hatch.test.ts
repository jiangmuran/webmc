import { describe, it, expect } from 'vitest';
import {
  hatchTicksFor,
  tick,
  isHatched,
  stage,
  EGG_MOSS_HATCH_TICKS,
  EGG_DEFAULT_HATCH_TICKS,
} from './sniffer_egg_hatch';

describe('sniffer egg hatch', () => {
  it('moss halves hatch time (wiki: 12000 / 24000 ticks)', () => {
    expect(hatchTicksFor(true)).toBe(EGG_MOSS_HATCH_TICKS);
    expect(hatchTicksFor(false)).toBe(EGG_DEFAULT_HATCH_TICKS);
    expect(EGG_MOSS_HATCH_TICKS).toBe(12000); // 10 min
    expect(EGG_DEFAULT_HATCH_TICKS).toBe(24000); // 20 min
  });

  it('tick increments', () => {
    expect(tick({ ticks: 5, onMoss: true }).ticks).toBe(6);
  });

  it('hatches on moss earlier', () => {
    expect(isHatched({ ticks: EGG_MOSS_HATCH_TICKS, onMoss: true })).toBe(true);
    expect(isHatched({ ticks: EGG_MOSS_HATCH_TICKS, onMoss: false })).toBe(false);
  });

  it('stage grows over time', () => {
    expect(stage({ ticks: 0, onMoss: true })).toBe(0);
    expect(stage({ ticks: EGG_MOSS_HATCH_TICKS / 2, onMoss: true })).toBe(1);
    expect(stage({ ticks: EGG_MOSS_HATCH_TICKS, onMoss: true })).toBe(2);
  });
});
