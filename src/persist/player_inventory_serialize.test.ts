import { describe, it, expect } from 'vitest';
import { serialize, deserialize } from './player_inventory_serialize';

describe('player inventory serialize', () => {
  it('roundtrip', () => {
    const inv = {
      hotbar: ['stone', null, 'dirt'],
      main: [],
      armor: [null, null, null, null],
      offhand: 'torch',
    };
    const r = deserialize(serialize(inv));
    expect(r).toEqual(inv);
  });

  it('bad json undefined', () => {
    expect(deserialize('not json')).toBeUndefined();
  });

  it('missing fields reject', () => {
    expect(deserialize('{}')).toBeUndefined();
  });
});
