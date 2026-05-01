import { describe, it, expect } from 'vitest';
import {
  compostChance,
  addItem,
  isReady,
  collectBonemeal,
  MAX_LEVEL,
} from './composter_level_fill';

describe('composter level fill', () => {
  it('cake 100% chance', () => {
    expect(compostChance('cake')).toBe(1);
  });

  it('non-compostable zero', () => {
    expect(compostChance('diamond')).toBe(0);
  });

  it('lucky roll increments', () => {
    expect(addItem({ level: 3 }, 'apple', () => 0).level).toBe(4);
  });

  it('unlucky roll stays', () => {
    expect(addItem({ level: 3 }, 'apple', () => 0.9).level).toBe(3);
  });

  it('full composter no change', () => {
    expect(addItem({ level: MAX_LEVEL }, 'cake', () => 0).level).toBe(MAX_LEVEL);
  });

  it('ready at level 8 (MAX_LEVEL, wiki block-state cap)', () => {
    expect(MAX_LEVEL).toBe(8);
    expect(isReady({ level: MAX_LEVEL })).toBe(true);
  });

  it('bamboo NOT compostable (wiki: MC-142452 WAI)', () => {
    expect(compostChance('bamboo')).toBe(0);
  });

  it('collect bonemeal resets', () => {
    const r = collectBonemeal({ level: MAX_LEVEL });
    expect(r.yielded).toBe(true);
    expect(r.result.level).toBe(0);
  });

  it('no collect when not ready', () => {
    expect(collectBonemeal({ level: 5 }).yielded).toBe(false);
  });
});
