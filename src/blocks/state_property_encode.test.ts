import { describe, it, expect } from 'vitest';
import { encodeIndex, decodeIndex, totalStates, type BlockFamily } from './state_property_encode';

const door: BlockFamily = {
  id: 'oak_door',
  properties: [
    { name: 'facing', values: ['north', 'south', 'east', 'west'] },
    { name: 'half', values: ['lower', 'upper'] },
    { name: 'open', values: ['false', 'true'] },
  ],
};

describe('state property encode', () => {
  it('total states 4*2*2 = 16', () => {
    expect(totalStates(door)).toBe(16);
  });

  it('round-trip', () => {
    const props = { facing: 'east', half: 'upper', open: 'true' };
    const idx = encodeIndex(door, props);
    expect(decodeIndex(door, idx)).toEqual(props);
  });

  it('unknown value falls back to 0', () => {
    const idx = encodeIndex(door, { facing: 'bogus', half: 'lower', open: 'false' });
    expect(decodeIndex(door, idx)['facing']).toBe('north');
  });

  it('missing key falls back to first', () => {
    const idx = encodeIndex(door, {});
    expect(decodeIndex(door, idx)['open']).toBe('false');
  });
});
