import { describe, it, expect } from 'vitest';
import {
  makeFrame,
  place,
  remove,
  rotate,
  comparatorOutput,
  MAX_ROTATIONS,
} from './item_frame_rotation';

describe('item frame', () => {
  it('place/remove', () => {
    const f = makeFrame();
    expect(place(f, 'webmc:apple')).toBe(true);
    expect(place(f, 'webmc:cake')).toBe(false);
    expect(remove(f)).toBe('webmc:apple');
    expect(f.itemId).toBeNull();
  });

  it('rotate wraps', () => {
    const f = makeFrame();
    place(f, 'x');
    for (let i = 0; i < MAX_ROTATIONS; i++) rotate(f);
    expect(f.rotation).toBe(0);
  });

  it('no rotate if empty', () => {
    const f = makeFrame();
    expect(rotate(f)).toBe(false);
  });

  it('comparator output', () => {
    const f = makeFrame();
    expect(comparatorOutput(f)).toBe(0);
    place(f, 'x');
    expect(comparatorOutput(f)).toBe(1);
    rotate(f);
    expect(comparatorOutput(f)).toBe(2);
  });

  it('remove resets rotation', () => {
    const f = makeFrame();
    place(f, 'x');
    rotate(f);
    rotate(f);
    remove(f);
    expect(f.rotation).toBe(0);
  });
});
