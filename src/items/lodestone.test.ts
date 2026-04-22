import { describe, it, expect } from 'vitest';
import {
  bindCompass,
  compassTargetFor,
  invalidateBinding,
  unbindCompass,
  type BoundCompass,
} from './lodestone';

const COMPASS: BoundCompass = { itemId: 1, count: 1, damage: 0 };

describe('lodestone compass', () => {
  it('binds a compass to a position', () => {
    const b = bindCompass(COMPASS, { x: 10, y: 64, z: -5 }, 'overworld');
    expect(b.binding).toBeDefined();
    expect(b.binding?.pos).toEqual({ x: 10, y: 64, z: -5 });
  });

  it('target matches binding in the same dimension', () => {
    const b = bindCompass(COMPASS, { x: 100, y: 64, z: 0 }, 'overworld');
    expect(compassTargetFor(b, 'overworld')).toEqual({ x: 100, y: 64, z: 0 });
  });

  it('returns null if in a different dimension', () => {
    const b = bindCompass(COMPASS, { x: 0, y: 64, z: 0 }, 'overworld');
    expect(compassTargetFor(b, 'nether')).toBeNull();
  });

  it('returns null if the lodestone is destroyed', () => {
    const b = bindCompass(COMPASS, { x: 0, y: 64, z: 0 }, 'overworld');
    invalidateBinding(b, { x: 0, y: 64, z: 0 }, 'overworld');
    expect(compassTargetFor(b, 'overworld')).toBeNull();
  });

  it('invalidateBinding ignores mismatched positions', () => {
    const b = bindCompass(COMPASS, { x: 0, y: 64, z: 0 }, 'overworld');
    invalidateBinding(b, { x: 1, y: 64, z: 0 }, 'overworld');
    expect(b.binding?.destroyed).toBe(false);
  });

  it('unbindCompass drops the binding', () => {
    const b = bindCompass(COMPASS, { x: 0, y: 0, z: 0 }, 'overworld');
    const u = unbindCompass(b) as BoundCompass;
    expect(u.binding).toBeUndefined();
  });
});
