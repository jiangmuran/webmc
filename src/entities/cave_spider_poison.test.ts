import { describe, it, expect } from 'vitest';
import {
  poisonTicks,
  fitsThroughOneBlockGap,
  climbsWalls,
  CAVE_SPIDER_HITBOX_HEIGHT,
} from './cave_spider_poison';

describe('cave spider poison', () => {
  it('easy no poison', () => {
    expect(poisonTicks('easy')).toBe(0);
  });

  it('normal poison 7s', () => {
    expect(poisonTicks('normal')).toBe(140);
  });

  it('hard poison 15s', () => {
    expect(poisonTicks('hard')).toBe(300);
  });

  it('fits through gap', () => {
    expect(fitsThroughOneBlockGap()).toBe(true);
  });

  it('climbs walls', () => {
    expect(climbsWalls()).toBe(true);
  });

  it('short hitbox', () => {
    expect(CAVE_SPIDER_HITBOX_HEIGHT).toBeLessThan(1);
  });
});
