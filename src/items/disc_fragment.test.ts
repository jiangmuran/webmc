import { describe, it, expect } from 'vitest';
import { addFragment, makeFragment, tryAssembleDisc } from './disc_fragment';

describe('disc fragment', () => {
  it('assembles disc after 9 fragments', () => {
    const f = makeFragment('five');
    addFragment(f, 8);
    const r = tryAssembleDisc(f);
    expect(r.discId).toBe('five');
    expect(r.leftover).toBe(0);
  });

  it('refuses with < 9 fragments', () => {
    const f = makeFragment('five');
    addFragment(f, 7);
    const r = tryAssembleDisc(f);
    expect(r.discId).toBeNull();
  });

  it('leaves leftover fragments', () => {
    const f = makeFragment('five');
    addFragment(f, 15);
    const r = tryAssembleDisc(f);
    expect(r.discId).toBe('five');
    expect(r.leftover).toBe(7);
  });
});
