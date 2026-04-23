import { describe, it, expect } from 'vitest';
import { tryGrow, onFruitBroken } from './pumpkin_stem_grow';

describe('pumpkin stem grow', () => {
  it('immature age++ on roll', () => {
    const r = tryGrow(
      { age: 0, maxAge: 7, fruitSpawned: false, hasEmptyDirtNeighbor: false },
      () => 0,
    );
    expect(r.state.age).toBe(1);
    expect(r.fruitPlaced).toBe(false);
  });

  it('mature places fruit with neighbor', () => {
    const r = tryGrow(
      { age: 7, maxAge: 7, fruitSpawned: false, hasEmptyDirtNeighbor: true },
      () => 0,
    );
    expect(r.fruitPlaced).toBe(true);
    expect(r.state.fruitSpawned).toBe(true);
  });

  it('no fruit without neighbor', () => {
    expect(
      tryGrow({ age: 7, maxAge: 7, fruitSpawned: false, hasEmptyDirtNeighbor: false }, () => 0)
        .fruitPlaced,
    ).toBe(false);
  });

  it('does not double-fruit', () => {
    expect(
      tryGrow({ age: 7, maxAge: 7, fruitSpawned: true, hasEmptyDirtNeighbor: true }, () => 0)
        .fruitPlaced,
    ).toBe(false);
  });

  it('break fruit resets flag', () => {
    expect(
      onFruitBroken({ age: 7, maxAge: 7, fruitSpawned: true, hasEmptyDirtNeighbor: true })
        .fruitSpawned,
    ).toBe(false);
  });
});
