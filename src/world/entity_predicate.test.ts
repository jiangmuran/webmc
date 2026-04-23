import { describe, it, expect } from 'vitest';
import { matches, type EntitySnapshot } from './entity_predicate';

const e: EntitySnapshot = {
  type: 'zombie',
  nbt: {},
  distance: 5,
  y: 64,
  equipment: { mainhand: 'iron_sword' },
};

describe('entity predicate', () => {
  it('type matches', () => {
    expect(matches({ type: 'zombie' }, e)).toBe(true);
  });

  it('wrong type', () => {
    expect(matches({ type: 'skeleton' }, e)).toBe(false);
  });

  it('distance cap', () => {
    expect(matches({ distanceMax: 3 }, e)).toBe(false);
    expect(matches({ distanceMax: 10 }, e)).toBe(true);
  });

  it('y range', () => {
    expect(matches({ location: { y: { min: 50, max: 70 } } }, e)).toBe(true);
    expect(matches({ location: { y: { min: 100 } } }, e)).toBe(false);
  });

  it('equipment match', () => {
    expect(matches({ equipment: { slot: 'mainhand', itemId: 'iron_sword' } }, e)).toBe(true);
    expect(matches({ equipment: { slot: 'mainhand', itemId: 'bow' } }, e)).toBe(false);
  });

  it('empty predicate matches anything', () => {
    expect(matches({}, e)).toBe(true);
  });
});
