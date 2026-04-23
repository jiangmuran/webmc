import { describe, it, expect } from 'vitest';
import { isDancing, emitsHappyParticle, DANCE_DURATION } from './piglin_dance_after_barter';

describe('piglin dance after barter', () => {
  it('fresh barter dances', () => {
    expect(isDancing({ justBarteredTick: 0, now: 10 })).toBe(true);
  });

  it('expired dance stops', () => {
    expect(isDancing({ justBarteredTick: 0, now: DANCE_DURATION })).toBe(false);
  });

  it('particles while dancing', () => {
    expect(emitsHappyParticle({ justBarteredTick: 0, now: 10 })).toBe(true);
  });
});
