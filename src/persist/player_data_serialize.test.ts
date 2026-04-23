import { describe, it, expect } from 'vitest';
import {
  serialize,
  deserialize,
  PLAYER_DATA_VERSION,
  type PersistedPlayer,
} from './player_data_serialize';

const sample: PersistedPlayer = {
  uuid: 'abc',
  name: 'alice',
  pos: [1, 64, 2],
  yaw: 0,
  pitch: 0,
  health: 20,
  food: 18,
  saturation: 5,
  xp: 0.3,
  xpLevel: 5,
  gameMode: 'survival',
};

describe('player data serialize', () => {
  it('round-trip', () => {
    const s = serialize(sample);
    expect(deserialize(s)).toEqual(sample);
  });

  it('version written', () => {
    expect(serialize(sample).version).toBe(PLAYER_DATA_VERSION);
  });

  it('wrong version returns undefined', () => {
    expect(deserialize({ version: 999, data: sample })).toBeUndefined();
  });

  it('non-object null', () => {
    expect(deserialize('nope')).toBeUndefined();
  });
});
