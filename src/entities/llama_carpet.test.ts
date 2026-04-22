import { describe, it, expect } from 'vitest';
import {
  addToCaravan,
  applyCarpet,
  attachChest,
  leaveCaravan,
  makeLlama,
  slotCountForStrength,
} from './llama_carpet';

describe('llama', () => {
  it('untamed rejects carpet', () => {
    const l = makeLlama(1);
    expect(applyCarpet(l, 'red').accepted).toBe(false);
  });

  it('tamed accepts carpet; swap returns previous', () => {
    const l = makeLlama(1);
    l.tamed = true;
    expect(applyCarpet(l, 'red').accepted).toBe(true);
    expect(applyCarpet(l, 'blue').previousCarpet).toBe('red');
  });

  it('chest slot count scales with strength', () => {
    expect(slotCountForStrength(1)).toBe(3);
    expect(slotCountForStrength(5)).toBe(15);
  });

  it('untamed rejects chest', () => {
    const l = makeLlama(1, 3);
    expect(attachChest(l).accepted).toBe(false);
  });

  it('tamed + chest gives slots', () => {
    const l = makeLlama(1, 4);
    l.tamed = true;
    expect(attachChest(l).slotCount).toBe(12);
  });

  it('caravan caps at 9 members', () => {
    const cv = { leaderId: 0, members: [] as number[] };
    for (let i = 1; i <= 12; i++) addToCaravan(cv, i);
    expect(cv.members.length).toBe(9);
  });

  it('leaveCaravan removes', () => {
    const cv = { leaderId: 0, members: [1, 2, 3] };
    leaveCaravan(cv, 2);
    expect(cv.members).toEqual([1, 3]);
  });
});
