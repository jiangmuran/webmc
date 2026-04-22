import { describe, it, expect } from 'vitest';
import { retract, pullsEntity, STICKY_PISTON_PUSH_LIMIT } from './sticky_piston_behavior';

describe('sticky piston behavior', () => {
  it('pulls block in front', () => {
    expect(retract({ frontBlock: 'other', inBetweenWasHoneyOrSlime: false })).toEqual({
      kind: 'pull',
      blockId: 'other',
    });
  });

  it('no pull for air', () => {
    expect(retract({ frontBlock: 'air', inBetweenWasHoneyOrSlime: false })).toEqual({
      kind: 'no_pull',
    });
  });

  it('no pull when honey/slime intermediary', () => {
    expect(retract({ frontBlock: 'other', inBetweenWasHoneyOrSlime: true })).toEqual({
      kind: 'no_pull',
    });
  });

  it('does not pull entities', () => {
    expect(pullsEntity()).toBe(false);
  });

  it('push limit 12', () => {
    expect(STICKY_PISTON_PUSH_LIMIT).toBe(12);
  });
});
