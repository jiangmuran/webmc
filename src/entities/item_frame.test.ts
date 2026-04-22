import { describe, it, expect } from 'vitest';
import { comparatorSignal, makeItemFrame, placeItem, rotateItem, takeItem } from './item_frame';

describe('item frame', () => {
  it('places one item at a time', () => {
    const f = makeItemFrame('north');
    const left = placeItem(f, { itemId: 5, count: 3, damage: 0 });
    expect(left?.count).toBe(2);
    expect(f.item?.count).toBe(1);
  });

  it('rotates 0..7 then wraps', () => {
    const f = makeItemFrame('north');
    placeItem(f, { itemId: 5, count: 1, damage: 0 });
    for (let i = 0; i < 8; i++) rotateItem(f);
    expect(f.rotation).toBe(0);
  });

  it('takeItem clears + resets rotation', () => {
    const f = makeItemFrame('east');
    placeItem(f, { itemId: 5, count: 1, damage: 0 });
    rotateItem(f);
    const out = takeItem(f);
    expect(out?.itemId).toBe(5);
    expect(f.rotation).toBe(0);
  });

  it('comparator signal matches rotation + 1', () => {
    const f = makeItemFrame('south');
    placeItem(f, { itemId: 5, count: 1, damage: 0 });
    rotateItem(f);
    rotateItem(f);
    expect(comparatorSignal(f)).toBe(3);
  });

  it('empty frame signals 0', () => {
    const f = makeItemFrame('up');
    expect(comparatorSignal(f)).toBe(0);
  });
});
