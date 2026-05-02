import { describe, it, expect } from 'vitest';
import {
  makeWololo,
  tryWololo,
  WOLOLO_COOLDOWN_MS,
  WOLOLO_RANGE,
  WOLOLO_SOURCE_COLOR,
  WOLOLO_TARGET_COLOR,
} from './evoker_wool_wololo';

describe('evoker wololo', () => {
  it('casts on closest target (blue) sheep (wiki)', () => {
    const s = makeWololo();
    const r = tryWololo(s, {
      nowMs: 10_000,
      targetSheepIds: ['a', 'b'],
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
      nowMs: 10_000,
      targetSheepIds: ['a'],
      sheepDistances: new Map([['a', WOLOLO_RANGE + 1]]),
    });
    expect(r).toBeNull();
  });

  it('cooldown is 7s (wiki: sheep color conversion cooldown 7s)', () => {
    expect(WOLOLO_COOLDOWN_MS).toBe(7_000);
    const s = makeWololo();
    tryWololo(s, {
      nowMs: 0,
      targetSheepIds: ['a'],
      sheepDistances: new Map([['a', 2]]),
    });
    expect(
      tryWololo(s, {
        nowMs: 1000,
        targetSheepIds: ['a'],
        sheepDistances: new Map([['a', 2]]),
      }),
    ).toBeNull();
    expect(
      tryWololo(s, {
        nowMs: WOLOLO_COOLDOWN_MS + 1,
        targetSheepIds: ['a'],
        sheepDistances: new Map([['a', 2]]),
      }),
    ).not.toBeNull();
  });

  it('no target sheep = no cast', () => {
    const s = makeWololo();
    expect(tryWololo(s, { nowMs: 0, targetSheepIds: [], sheepDistances: new Map() })).toBeNull();
  });

  it('blue → red color rule (wiki, JE 19w04a)', () => {
    expect(WOLOLO_SOURCE_COLOR).toBe('blue');
    expect(WOLOLO_TARGET_COLOR).toBe('red');
  });

  it('legacy whiteSheepIds alias still works (back-compat)', () => {
    const s = makeWololo();
    const r = tryWololo(s, {
      nowMs: 10_000,
      whiteSheepIds: ['a'],
      sheepDistances: new Map([['a', 5]]),
    });
    expect(r?.targetSheepId).toBe('a');
  });
});
