import { describe, it, expect } from 'vitest';
import { canSpread, diesBack, decayChance, DECAY_CHANCE_MYCELIUM } from './grass_block_spread';

describe('grass spread', () => {
  it('spreads to well-lit dirt', () => {
    expect(
      canSpread({
        sourceBlockId: 'webmc:grass_block',
        targetIsDirt: true,
        lightAboveTarget: 10,
        targetObstructedAbove: false,
      }),
    ).toBe(true);
  });

  it('no spread when obscured', () => {
    expect(
      canSpread({
        sourceBlockId: 'webmc:grass_block',
        targetIsDirt: true,
        lightAboveTarget: 15,
        targetObstructedAbove: true,
      }),
    ).toBe(false);
  });

  it('dies in darkness', () => {
    expect(diesBack({ blockId: 'webmc:grass_block', lightAbove: 2, obstructedAbove: false })).toBe(
      true,
    );
  });

  it('mycelium decays faster', () => {
    expect(decayChance('webmc:mycelium')).toBe(DECAY_CHANCE_MYCELIUM);
  });
});
