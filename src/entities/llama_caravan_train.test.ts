import { describe, it, expect } from 'vitest';
import {
  joinsCaravan,
  caravanLongerThanMax,
  strayAfterDisconnect,
  CARAVAN_LENGTH_MAX,
} from './llama_caravan_train';

describe('llama caravan', () => {
  it('joins with trader', () => {
    expect(joinsCaravan({ leashedToTraderTick: 0, followingOther: false }, true)).toBe(true);
  });

  it('already following skips', () => {
    expect(joinsCaravan({ leashedToTraderTick: 0, followingOther: true }, true)).toBe(false);
  });

  it('caravan length cap', () => {
    expect(caravanLongerThanMax(CARAVAN_LENGTH_MAX + 1)).toBe(true);
  });

  it('stray after gap', () => {
    expect(strayAfterDisconnect({ leashedToTraderTick: 0, followingOther: true }, 1000)).toBe(true);
  });
});
