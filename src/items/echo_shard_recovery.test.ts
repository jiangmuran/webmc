import { describe, it, expect } from 'vitest';
import {
  canCraftRecoveryCompass,
  echoShardFoundInAncientCity,
  RECIPE_ECHO_SHARDS,
} from './echo_shard_recovery';

describe('echo shard recovery compass', () => {
  it('needs 1 compass + 8 shards', () => {
    expect(canCraftRecoveryCompass({ compassSlots: 1, echoShardSlots: 8 })).toBe(true);
    expect(RECIPE_ECHO_SHARDS).toBe(8);
  });

  it('insufficient shards fail', () => {
    expect(canCraftRecoveryCompass({ compassSlots: 1, echoShardSlots: 7 })).toBe(false);
  });

  it('no compass fails', () => {
    expect(canCraftRecoveryCompass({ compassSlots: 0, echoShardSlots: 8 })).toBe(false);
  });

  it('shard drops from ancient city', () => {
    expect(echoShardFoundInAncientCity()).toBe(true);
  });
});
