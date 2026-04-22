import { describe, it, expect } from 'vitest';
import { headPosFor, onBodyBroken, onHeadBroken } from './piston_head_detach';

describe('piston head detach', () => {
  it('head pos up', () => {
    expect(headPosFor({ bodyPos: { x: 0, y: 0, z: 0 }, direction: 'up', sticky: false })).toEqual({
      x: 0,
      y: 1,
      z: 0,
    });
  });

  it('head pos south', () => {
    expect(
      headPosFor({ bodyPos: { x: 5, y: 10, z: 5 }, direction: 'south', sticky: false }),
    ).toEqual({ x: 5, y: 10, z: 6 });
  });

  it('body break drops sticky piston', () => {
    const r = onBodyBroken({
      bodyPos: { x: 1, y: 2, z: 3 },
      direction: 'up',
      sticky: true,
    });
    expect(r.dropItem).toBe('webmc:sticky_piston');
    expect(r.removeHeadAt).toEqual({ x: 1, y: 3, z: 3 });
  });

  it('head break removes body', () => {
    const r = onHeadBroken({
      bodyPos: { x: 0, y: 0, z: 0 },
      direction: 'east',
      sticky: false,
    });
    expect(r.removeBodyAt).toEqual({ x: 0, y: 0, z: 0 });
  });
});
