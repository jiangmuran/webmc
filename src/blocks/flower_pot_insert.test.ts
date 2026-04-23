import { describe, it, expect } from 'vitest';
import { canInsert, insert, takeOut } from './flower_pot_insert';

describe('flower pot insert', () => {
  it('empty pot accepts poppy', () => {
    expect(canInsert({}, 'poppy')).toBe(true);
  });

  it('filled pot rejects second', () => {
    expect(canInsert({ content: 'poppy' }, 'dandelion')).toBe(false);
  });

  it('rejects disallowed', () => {
    expect(canInsert({}, 'stone')).toBe(false);
  });

  it('insert sets content', () => {
    expect(insert({}, 'fern').content).toBe('fern');
  });

  it('take out drops', () => {
    const r = takeOut({ content: 'allium' });
    expect(r.dropped).toBe('allium');
    expect(r.newPot.content).toBeUndefined();
  });

  it('take empty nothing', () => {
    expect(takeOut({}).dropped).toBeUndefined();
  });
});
