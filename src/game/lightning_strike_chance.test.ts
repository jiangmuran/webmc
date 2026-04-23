import { describe, it, expect } from 'vitest';
import { tryStrike, strikeHeight } from './lightning_strike_chance';

describe('lightning strike chance', () => {
  it('no thunder no strike', () => {
    expect(
      tryStrike({ isThundering: false, chunkIsLoaded: true, skyVisible: true, rng: () => 0 }),
    ).toBe(false);
  });

  it('covered no strike', () => {
    expect(
      tryStrike({ isThundering: true, chunkIsLoaded: true, skyVisible: false, rng: () => 0 }),
    ).toBe(false);
  });

  it('thundering + sky + lucky rng', () => {
    expect(
      tryStrike({ isThundering: true, chunkIsLoaded: true, skyVisible: true, rng: () => 0 }),
    ).toBe(true);
  });

  it('height is top block', () => {
    expect(strikeHeight(80)).toBe(80);
  });
});
