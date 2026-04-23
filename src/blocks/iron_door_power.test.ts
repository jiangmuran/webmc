import { describe, it, expect } from 'vitest';
import { isOpen, handOpenIgnored } from './iron_door_power';

describe('iron door power', () => {
  it('redstone opens', () => {
    expect(isOpen({ redstonePowered: true, openedByHand: false })).toBe(true);
  });

  it('hand alone does not open', () => {
    expect(isOpen({ redstonePowered: false, openedByHand: true })).toBe(false);
  });

  it('hand try flagged', () => {
    expect(handOpenIgnored({ redstonePowered: false, openedByHand: true })).toBe(true);
  });
});
