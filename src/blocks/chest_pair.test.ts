import { describe, it, expect } from 'vitest';
import {
  canPairWith,
  inventorySize,
  blockedByOcelotOnTop,
  needsFreeSpaceAbove,
} from './chest_pair';

describe('chest pair', () => {
  it('pairs facing same direction', () => {
    expect(
      canPairWith({ facing: 'north', half: 'single' }, { facing: 'north', half: 'single' }),
    ).toBe(true);
  });

  it('no pair different facings', () => {
    expect(
      canPairWith({ facing: 'north', half: 'single' }, { facing: 'south', half: 'single' }),
    ).toBe(false);
  });

  it('no triple chests', () => {
    expect(
      canPairWith({ facing: 'north', half: 'single' }, { facing: 'north', half: 'left' }),
    ).toBe(false);
  });

  it('single 27 slots', () => {
    expect(inventorySize('single')).toBe(27);
  });

  it('double 54 slots', () => {
    expect(inventorySize('left')).toBe(54);
  });

  it('ocelot above blocks open', () => {
    expect(blockedByOcelotOnTop(true)).toBe(true);
    expect(blockedByOcelotOnTop(false)).toBe(false);
  });

  it('needs free space', () => {
    expect(needsFreeSpaceAbove()).toBe(true);
  });
});
