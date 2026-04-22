import { describe, it, expect } from 'vitest';
import { matches, matchesAny, type Chord } from './keybind_chord';

describe('key chord', () => {
  it('plain match', () => {
    const c: Chord = { key: 'F3' };
    expect(matches(c, { key: 'F3', shift: false, ctrl: false, alt: false })).toBe(true);
    expect(matches(c, { key: 'F3', shift: true, ctrl: false, alt: false })).toBe(false);
  });

  it('shift match', () => {
    const c: Chord = { key: 'S', shift: true };
    expect(matches(c, { key: 'S', shift: true, ctrl: false, alt: false })).toBe(true);
  });

  it('anyModifiers ignores', () => {
    const c: Chord = { key: 'X', anyModifiers: true };
    expect(matches(c, { key: 'X', shift: true, ctrl: true, alt: true })).toBe(true);
  });

  it('matchesAny prefers stricter', () => {
    const plain: Chord = { key: 'S' };
    const ctrlS: Chord = { key: 'S', ctrl: true };
    const r = matchesAny([plain, ctrlS], { key: 'S', shift: false, ctrl: true, alt: false });
    expect(r).toBe(ctrlS);
  });

  it('no match returns null', () => {
    expect(
      matchesAny([{ key: 'F' }], { key: 'X', shift: false, ctrl: false, alt: false }),
    ).toBeNull();
  });
});
