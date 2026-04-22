import { describe, it, expect } from 'vitest';
import { cloneMap, lockMap, craftCopy, canEnlarge } from './map_copy_lock';

describe('map copy lock', () => {
  it('clone deep-copies bits', () => {
    const src = { id: 1, exploredBits: new Uint8Array([1, 2, 3]), locked: false };
    const c = cloneMap(src, 2);
    c.exploredBits[0] = 99;
    expect(src.exploredBits[0]).toBe(1);
  });

  it('lock once', () => {
    const m = { id: 1, exploredBits: new Uint8Array(0), locked: false };
    expect(lockMap(m)).toBe(true);
    expect(lockMap(m)).toBe(false);
  });

  it('craftCopy null safe', () => {
    expect(craftCopy(null, 2)).toBeNull();
  });

  it('enlarge bound', () => {
    expect(canEnlarge(0)).toBe(true);
    expect(canEnlarge(4)).toBe(false);
  });
});
