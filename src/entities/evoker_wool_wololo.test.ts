import { describe, it, expect } from 'vitest';
import { makeWololo, tryWololo, WOLOLO_COOLDOWN_MS, WOLOLO_RANGE } from './evoker_wool_wololo';

describe('evoker wololo', () => {
  it('casts on closest white sheep', () => {
    const s = makeWololo();
    const r = tryWololo(s, {
      nowMs: 1000,
      whiteSheepIds: ['a', 'b'],
      sheepDistances: new Map([
        ['a', 10],
        ['b', 3],
      ]),
    });
    expect(r?.targetSheepId).toBe('b');
  });

  it('no sheep in range', () => {
    const s = makeWololo();
    const r = tryWololo(s, {
      nowMs: 1000,
      whiteSheepIds: ['a'],
      sheepDistances: new Map([['a', WOLOLO_RANGE + 1]]),
    });
    expect(r).toBeNull();
  });

  it('cooldown blocks', () => {
    const s = makeWololo();
    tryWololo(s, {
      nowMs: 0,
      whiteSheepIds: ['a'],
      sheepDistances: new Map([['a', 2]]),
    });
    expect(
      tryWololo(s, {
        nowMs: 1000,
        whiteSheepIds: ['a'],
        sheepDistances: new Map([['a', 2]]),
      }),
    ).toBeNull();
    expect(
      tryWololo(s, {
        nowMs: WOLOLO_COOLDOWN_MS + 1,
        whiteSheepIds: ['a'],
        sheepDistances: new Map([['a', 2]]),
      }),
    ).not.toBeNull();
  });

  it('no white sheep = no cast', () => {
    const s = makeWololo();
    expect(tryWololo(s, { nowMs: 0, whiteSheepIds: [], sheepDistances: new Map() })).toBeNull();
  });
});
