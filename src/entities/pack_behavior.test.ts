import { describe, it, expect } from 'vitest';
import { makePack, addMember, onMemberHurt, tick, anyRetaliating } from './pack_behavior';

describe('pack behavior', () => {
  it('all retaliate when one hurt', () => {
    const p = makePack(100);
    addMember(p, 'a');
    addMember(p, 'b');
    onMemberHurt(p, 'a', 0);
    expect(p.members.get('b')?.retaliating).toBe(true);
  });

  it('retaliation fades after duration', () => {
    const p = makePack(100);
    addMember(p, 'a');
    onMemberHurt(p, 'a', 0);
    tick(p, 200);
    expect(anyRetaliating(p)).toBe(false);
  });

  it('before duration still angry', () => {
    const p = makePack(100);
    addMember(p, 'a');
    onMemberHurt(p, 'a', 0);
    tick(p, 50);
    expect(anyRetaliating(p)).toBe(true);
  });

  it('hurting unknown no-op', () => {
    const p = makePack(100);
    onMemberHurt(p, 'ghost', 0);
    expect(anyRetaliating(p)).toBe(false);
  });
});
