import { describe, it, expect } from 'vitest';
import {
  vanishesOnDeath,
  droppedOnDeath,
  removableByGrindstone,
  preservedByAnvil,
} from './curse_vanishing';

describe('curse of vanishing', () => {
  it('vanishes with curse', () => {
    expect(vanishesOnDeath(true)).toBe(true);
  });

  it('drops without', () => {
    expect(droppedOnDeath(false)).toBe(true);
  });

  it('grindstone cannot remove', () => {
    expect(removableByGrindstone()).toBe(false);
  });

  it('anvil preserves', () => {
    expect(preservedByAnvil()).toBe(true);
  });
});
