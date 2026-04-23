import { describe, it, expect } from 'vitest';
import { canPlace, climbable, breaksWhenBackingBroken } from './ladder_attach';

describe('ladder attach', () => {
  it('needs solid backing', () => {
    expect(canPlace({ attachFace: 'north', backingSolid: true })).toBe(true);
    expect(canPlace({ attachFace: 'north', backingSolid: false })).toBe(false);
  });

  it('always climbable', () => {
    expect(climbable()).toBe(true);
  });

  it('drops when backing gone', () => {
    expect(breaksWhenBackingBroken({ attachFace: 'north', backingSolid: false })).toBe(true);
  });
});
