import { describe, it, expect } from 'vitest';
import { makeLlama, joinCaravan, leaveCaravan, caravanLength } from './llama_caravan';

describe('llama caravan', () => {
  it('joins chain', () => {
    const a = makeLlama('a');
    const b = makeLlama('b');
    expect(joinCaravan(a, b)).toBe(true);
    expect(b.leadingId).toBe('a');
  });

  it('cannot double-follow', () => {
    const a = makeLlama('a');
    const b = makeLlama('b');
    const c = makeLlama('c');
    joinCaravan(a, b);
    expect(joinCaravan(c, b)).toBe(false);
  });

  it('chain length', () => {
    const all = new Map<string, ReturnType<typeof makeLlama>>();
    const a = makeLlama('a');
    const b = makeLlama('b');
    const c = makeLlama('c');
    const d = makeLlama('d');
    all.set('a', a);
    all.set('b', b);
    all.set('c', c);
    all.set('d', d);
    joinCaravan(a, b);
    joinCaravan(b, c);
    joinCaravan(c, d);
    expect(caravanLength(a, all)).toBe(4);
  });

  it('leave breaks chain', () => {
    const all = new Map<string, ReturnType<typeof makeLlama>>();
    const a = makeLlama('a');
    const b = makeLlama('b');
    const c = makeLlama('c');
    all.set('a', a);
    all.set('b', b);
    all.set('c', c);
    joinCaravan(a, b);
    joinCaravan(b, c);
    leaveCaravan(b, all);
    expect(a.followerId).toBeNull();
    expect(c.leadingId).toBeNull();
  });
});
