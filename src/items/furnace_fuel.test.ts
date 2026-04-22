import { describe, it, expect } from 'vitest';
import {
  burnSecondsFor,
  igniteFurnace,
  isFuel,
  makeBurn,
  smeltsPerUnit,
  tickBurn,
} from './furnace_fuel';

describe('furnace fuel', () => {
  it('coal burns 80s', () => {
    expect(burnSecondsFor('webmc:coal')).toBe(80);
  });

  it('stone is not fuel', () => {
    expect(isFuel('webmc:stone')).toBe(false);
  });

  it('lava bucket is the longest fuel', () => {
    expect(burnSecondsFor('webmc:lava_bucket')).toBe(1000);
  });

  it('coal smelts 8 items', () => {
    expect(smeltsPerUnit('webmc:coal')).toBe(8);
  });

  it('ignite sets burn time and consumes fuel', () => {
    const s = makeBurn();
    expect(igniteFurnace(s, 'webmc:coal')).toBe(true);
    expect(s.burnSecondsRemaining).toBe(80);
  });

  it('cannot ignite already-burning furnace', () => {
    const s = makeBurn();
    igniteFurnace(s, 'webmc:coal');
    expect(igniteFurnace(s, 'webmc:coal')).toBe(false);
  });

  it('cannot ignite with non-fuel', () => {
    const s = makeBurn();
    expect(igniteFurnace(s, 'webmc:stone')).toBe(false);
  });

  it('tick reduces burn time', () => {
    const s = makeBurn();
    igniteFurnace(s, 'webmc:coal');
    tickBurn(s, 5);
    expect(s.burnSecondsRemaining).toBe(75);
  });
});
