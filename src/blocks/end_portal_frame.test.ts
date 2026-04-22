import { describe, it, expect } from 'vitest';
import {
  checkPortal,
  expectedFrameFacing,
  FRAME_POSITIONS,
  insertEye,
  type EndPortalFrame,
} from './end_portal_frame';

describe('end portal frame', () => {
  it('12 positions', () => {
    expect(FRAME_POSITIONS.length).toBe(12);
  });

  it('expected facing at west edge', () => {
    expect(expectedFrameFacing({ xOffset: -1, zOffset: 1 })).toBe('east');
  });

  it('corners excluded', () => {
    expect(expectedFrameFacing({ xOffset: -1, zOffset: -1 })).toBeNull();
  });

  it('incomplete ring = inactive', () => {
    const r = checkPortal({ frames: [] });
    expect(r.active).toBe(false);
  });

  it('full ring + eyes + correct facing = active', () => {
    const frames = FRAME_POSITIONS.map((pos) => {
      const expected = expectedFrameFacing(pos);
      const frame: EndPortalFrame = {
        facing: expected ?? 'north',
        hasEye: true,
      };
      return { pos, frame };
    });
    const r = checkPortal({ frames });
    expect(r.active).toBe(true);
  });

  it('missing eye = inactive', () => {
    const frames = FRAME_POSITIONS.map((pos) => {
      const expected = expectedFrameFacing(pos);
      const frame: EndPortalFrame = {
        facing: expected ?? 'north',
        hasEye: false,
      };
      return { pos, frame };
    });
    const r = checkPortal({ frames });
    expect(r.active).toBe(false);
    expect(r.allPresent).toBe(true);
  });

  it('insertEye idempotent', () => {
    const f: EndPortalFrame = { facing: 'north', hasEye: false };
    expect(insertEye(f)).toBe(true);
    expect(insertEye(f)).toBe(false);
  });
});
