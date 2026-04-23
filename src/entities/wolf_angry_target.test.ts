import { describe, it, expect } from 'vitest';
import {
  attackedBy,
  tickAnger,
  isHostileTo,
  ANGRY_DURATION,
  type WolfState,
} from './wolf_angry_target';

const wild: WolfState = { tamed: false, angryTicksRemaining: 0 };
const tame: WolfState = { tamed: true, ownerId: 'alice', angryTicksRemaining: 0 };

describe('wolf anger', () => {
  it('wild wolf angry at attacker', () => {
    const s = attackedBy(wild, 'bob');
    expect(s.angryTicksRemaining).toBe(ANGRY_DURATION);
    expect(s.angryAtId).toBe('bob');
  });

  it('tamed wolf ignores owner strike', () => {
    const s = attackedBy(tame, 'alice');
    expect(s.angryTicksRemaining).toBe(0);
  });

  it('tamed wolf angry at stranger', () => {
    const s = attackedBy(tame, 'bob');
    expect(s.angryAtId).toBe('bob');
  });

  it('tick drains anger', () => {
    const s = attackedBy(wild, 'bob');
    const t = tickAnger(s);
    expect(t.angryTicksRemaining).toBe(ANGRY_DURATION - 1);
  });

  it('anger clears at zero', () => {
    const s: WolfState = { tamed: false, angryAtId: 'bob', angryTicksRemaining: 1 };
    expect(tickAnger(s).angryAtId).toBeUndefined();
  });

  it('hostility requires both anger and match', () => {
    const s = attackedBy(wild, 'bob');
    expect(isHostileTo(s, 'bob')).toBe(true);
    expect(isHostileTo(s, 'carol')).toBe(false);
  });
});
