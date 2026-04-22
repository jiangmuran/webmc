import { describe, it, expect } from 'vitest';
import {
  makeMooshroom,
  milkStew,
  shear,
  onLightning,
  flowerEffect,
} from './mooshroom_mushroom_stew';

describe('mooshroom', () => {
  it('red yields mushroom stew', () => {
    expect(milkStew(makeMooshroom('red'))).toBe('webmc:mushroom_stew');
  });

  it('brown yields suspicious stew', () => {
    expect(milkStew(makeMooshroom('brown'))).toBe('webmc:suspicious_stew');
  });

  it('shear drops mushrooms and transforms', () => {
    const m = makeMooshroom('red');
    const r = shear(m);
    expect(r?.dropped.id).toBe('webmc:red_mushroom');
    expect(r?.dropped.count).toBe(5);
    expect(r?.transformedTo).toBe('webmc:cow');
  });

  it('shear only once', () => {
    const m = makeMooshroom();
    shear(m);
    expect(shear(m)).toBeNull();
  });

  it('lightning flips', () => {
    const m = makeMooshroom('red');
    onLightning(m);
    expect(m.variant).toBe('brown');
    onLightning(m);
    expect(m.variant).toBe('red');
  });

  it('flower → effect', () => {
    expect(flowerEffect('webmc:wither_rose')).toBe('wither');
    expect(flowerEffect('webmc:stone')).toBeNull();
  });
});
