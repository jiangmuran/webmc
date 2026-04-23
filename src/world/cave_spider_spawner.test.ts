import { describe, it, expect } from 'vitest';
import {
  isSpawnerSpot,
  cobwebCellsAround,
  SPAWNER_CORRIDOR_INTERVAL_BLOCKS,
} from './cave_spider_spawner';

describe('cave spider spawner', () => {
  it('spawns at interval', () => {
    expect(isSpawnerSpot(SPAWNER_CORRIDOR_INTERVAL_BLOCKS)).toBe(true);
    expect(isSpawnerSpot(SPAWNER_CORRIDOR_INTERVAL_BLOCKS + 1)).toBe(false);
  });

  it('cobweb cells count', () => {
    expect(cobwebCellsAround(0, 0, 0).length).toBeGreaterThan(10);
  });

  it('cobweb excludes center', () => {
    const cells = cobwebCellsAround(0, 0, 0);
    expect(cells.find((c) => c.x === 0 && c.y === 0 && c.z === 0)).toBeUndefined();
  });
});
