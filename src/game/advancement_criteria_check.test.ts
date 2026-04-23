import { describe, it, expect } from 'vitest';
import { satisfied, nextMissing } from './advancement_criteria_check';

const def = {
  id: 'first_steps',
  requires: [['move_1m'], ['place_block', 'break_block']],
};

describe('advancement criteria check', () => {
  it('all done satisfied', () => {
    expect(
      satisfied(def, [
        { id: 'move_1m', achievedAt: 1 },
        { id: 'place_block', achievedAt: 2 },
      ]),
    ).toBe(true);
  });

  it('partial not satisfied', () => {
    expect(satisfied(def, [{ id: 'move_1m', achievedAt: 1 }])).toBe(false);
  });

  it('missing lists remaining', () => {
    expect(nextMissing(def, [{ id: 'move_1m', achievedAt: 1 }])).toContain('place_block');
  });
});
