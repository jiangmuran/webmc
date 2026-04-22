import { describe, it, expect } from 'vitest';
import {
  lightningStrikeMooshroom,
  makeMooshroom,
  milkMooshroom,
  shearMooshroom,
} from './mooshroom';

describe('mooshroom', () => {
  it('lightning flips color', () => {
    const m = makeMooshroom('red');
    lightningStrikeMooshroom(m);
    expect(m.color).toBe('brown');
    lightningStrikeMooshroom(m);
    expect(m.color).toBe('red');
  });

  it('shearing drops 5 mushrooms + converts to cow', () => {
    const m = makeMooshroom('red');
    const r = shearMooshroom(m);
    expect(r?.dropsMushrooms.length).toBe(5);
    expect(r?.convertedTo).toBe('cow');
  });

  it('shearing an already-sheared mooshroom returns null', () => {
    const m = makeMooshroom('red');
    shearMooshroom(m);
    expect(shearMooshroom(m)).toBeNull();
  });

  it('milk red mooshroom → mushroom stew', () => {
    expect(milkMooshroom(makeMooshroom('red'), null)).toBe('webmc:mushroom_stew');
  });

  it('milk brown + last flower → suspicious stew', () => {
    expect(milkMooshroom(makeMooshroom('brown'), 'webmc:cornflower')).toBe('webmc:suspicious_stew');
  });

  it('milk brown without flower → regular stew', () => {
    expect(milkMooshroom(makeMooshroom('brown'), null)).toBe('webmc:mushroom_stew');
  });
});
