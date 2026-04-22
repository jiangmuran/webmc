import { describe, it, expect } from 'vitest';
import {
  eatSpiderEye,
  eatPufferfish,
  POISON_DURATION_TICKS,
  SPIDER_EYE_HUNGER,
} from './spider_eye_food';

describe('spider eye food', () => {
  it('hunger + poison', () => {
    const r = eatSpiderEye();
    expect(r.hunger).toBe(SPIDER_EYE_HUNGER);
    expect(r.debuffs[0]?.id).toBe('poison');
    expect(r.debuffs[0]?.durationTicks).toBe(POISON_DURATION_TICKS);
  });

  it('pufferfish many debuffs', () => {
    const r = eatPufferfish();
    expect(r.debuffs.length).toBe(3);
    expect(r.debuffs.find((d) => d.id === 'nausea')).toBeTruthy();
  });
});
