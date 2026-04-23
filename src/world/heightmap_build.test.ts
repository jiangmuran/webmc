import { describe, it, expect } from 'vitest';
import { buildTopSolid, heightAt, CHUNK_SIZE } from './heightmap_build';

describe('heightmap build', () => {
  it('flat terrain y=64 everywhere', () => {
    const map = buildTopSolid({
      getBlockY: (_x, _z, y) => (y <= 64 ? 'stone' : 'air'),
      topY: 255,
      bottomY: 0,
    });
    expect(heightAt(map, 5, 5)).toBe(64);
  });

  it('empty column returns sentinel', () => {
    const map = buildTopSolid({
      getBlockY: () => 'air',
      topY: 255,
      bottomY: 0,
    });
    expect(heightAt(map, 0, 0)).toBe(-1);
  });

  it('size matches chunk area', () => {
    const map = buildTopSolid({
      getBlockY: () => 'air',
      topY: 255,
      bottomY: 0,
    });
    expect(map.length).toBe(CHUNK_SIZE * CHUNK_SIZE);
  });

  it('picks highest solid', () => {
    const map = buildTopSolid({
      getBlockY: (x, _z, y) => (x === 3 && y === 80 ? 'stone' : y === 50 ? 'stone' : 'air'),
      topY: 255,
      bottomY: 0,
    });
    expect(heightAt(map, 3, 0)).toBe(80);
    expect(heightAt(map, 1, 0)).toBe(50);
  });
});
