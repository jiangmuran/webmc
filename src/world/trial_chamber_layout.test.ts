import { describe, it, expect } from 'vitest';
import {
  TRIAL_ROOM_WEIGHTS,
  isReward,
  isSpawnerLike,
  TRIAL_VOLUME_MIN_BLOCKS,
} from './trial_chamber_layout';

describe('trial chamber layout', () => {
  it('corridor most common', () => {
    expect(TRIAL_ROOM_WEIGHTS.corridor).toBeGreaterThan(TRIAL_ROOM_WEIGHTS.ominous_vault_room);
  });

  it('reward room identified', () => {
    expect(isReward('reward_vault')).toBe(true);
    expect(isReward('corridor')).toBe(false);
  });

  it('spawner-like breeze', () => {
    expect(isSpawnerLike('breeze_room')).toBe(true);
  });

  it('volume min large', () => {
    expect(TRIAL_VOLUME_MIN_BLOCKS).toBeGreaterThan(10000);
  });
});
