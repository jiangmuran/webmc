import { describe, it, expect } from 'vitest';
import { indexOf, getHeight, setHeight, WIDTH } from './chunk_heightmap_store';

const blank = { data: new Int16Array(WIDTH * WIDTH), type: 'world_surface' as const };

describe('chunk heightmap store', () => {
  it('index maps in-range', () => {
    expect(indexOf(0, 0)).toBe(0);
    expect(indexOf(15, 15)).toBe(WIDTH * WIDTH - 1);
  });

  it('set/get roundtrip', () => {
    const h = { data: new Int16Array(WIDTH * WIDTH), type: 'world_surface' as const };
    setHeight(h, 3, 5, 123);
    expect(getHeight(h, 3, 5)).toBe(123);
  });

  it('uninitialized is 0', () => {
    expect(getHeight(blank, 7, 7)).toBe(0);
  });
});
