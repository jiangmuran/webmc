import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  AIR,
  AIR_ID,
  MAX_BLOCK_ID,
  MAX_PROPS,
  isAir,
  makeState,
  stateId,
  stateProps,
} from './state';

describe('BlockState', () => {
  it('AIR is id 0 props 0', () => {
    expect(AIR).toBe(0);
    expect(stateId(AIR)).toBe(AIR_ID);
    expect(stateProps(AIR)).toBe(0);
    expect(isAir(AIR)).toBe(true);
  });

  it('round-trips arbitrary (id, props) within bounds', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: MAX_BLOCK_ID }),
        fc.integer({ min: 0, max: MAX_PROPS }),
        (id, props) => {
          const s = makeState(id, props);
          expect(stateId(s)).toBe(id);
          expect(stateProps(s)).toBe(props);
        },
      ),
    );
  });

  it('truncates oversized id/props to 16 bits rather than colliding fields', () => {
    const s = makeState(MAX_BLOCK_ID + 5, MAX_PROPS + 7);
    expect(stateId(s)).toBe((MAX_BLOCK_ID + 5) & MAX_BLOCK_ID);
    expect(stateProps(s)).toBe((MAX_PROPS + 7) & MAX_PROPS);
  });

  it('distinct (id, props) pairs produce distinct states', () => {
    const seen = new Set<number>();
    for (let id = 0; id < 64; id++) {
      for (let p = 0; p < 64; p++) {
        const s = makeState(id, p);
        expect(seen.has(s)).toBe(false);
        seen.add(s);
      }
    }
  });
});
