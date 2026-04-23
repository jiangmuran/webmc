import { describe, it, expect } from 'vitest';
import {
  isSolved,
  flip,
  LEVER_COUNT,
  COMBINATIONS,
  ARROW_DISPENSER_COUNT,
  HIDDEN_CHEST_COUNT,
} from './jungle_pyramid_puzzle';

describe('jungle pyramid puzzle', () => {
  it('3 levers, 8 combos', () => {
    expect(LEVER_COUNT).toBe(3);
    expect(COMBINATIONS).toBe(8);
  });

  it('solved when match', () => {
    expect(isSolved({ levers: [true, false, true] }, [true, false, true])).toBe(true);
  });

  it('not solved mismatch', () => {
    expect(isSolved({ levers: [true, false, true] }, [false, false, true])).toBe(false);
  });

  it('flip toggles', () => {
    const s = flip({ levers: [false, false, false] }, 1);
    expect(s.levers[1]).toBe(true);
    expect(s.levers[0]).toBe(false);
  });

  it('traps + chests', () => {
    expect(ARROW_DISPENSER_COUNT).toBe(2);
    expect(HIDDEN_CHEST_COUNT).toBe(2);
  });
});
