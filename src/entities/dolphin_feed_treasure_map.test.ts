import { describe, it, expect } from 'vitest';
import {
  feed,
  isLeading,
  targetAfterFirstReached,
  type DolphinState,
} from './dolphin_feed_treasure_map';

const base: DolphinState = { gotFish: false };

describe('dolphin feed/treasure', () => {
  it('feeding gives fish status', () => {
    expect(feed(base, 'alice').gotFish).toBe(true);
  });

  it('leads fed player', () => {
    expect(isLeading(feed(base, 'alice'))).toBe(true);
  });

  it('not leading when unfed', () => {
    expect(isLeading(base)).toBe(false);
  });

  it('default target shipwreck', () => {
    expect(feed(base, 'a').targetStructure).toBe('shipwreck');
  });

  it('shipwreck → buried treasure', () => {
    expect(targetAfterFirstReached('shipwreck')).toBe('buried_treasure');
  });

  it('buried treasure is final', () => {
    expect(targetAfterFirstReached('buried_treasure')).toBeUndefined();
  });
});
