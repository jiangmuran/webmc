import { describe, it, expect } from 'vitest';
import {
  onPlayerOpen,
  onPlayerClose,
  blockedByBlockAbove,
  type BarrelState,
} from './barrel_open_close';

const closed: BarrelState = { open: false, viewerCount: 0, facing: 'up' };

describe('barrel open close', () => {
  it('first opener opens', () => {
    const s = onPlayerOpen(closed);
    expect(s.open).toBe(true);
    expect(s.viewerCount).toBe(1);
  });

  it('close drops viewer', () => {
    const open = onPlayerOpen(closed);
    expect(onPlayerClose(open).open).toBe(false);
  });

  it('still open with remaining viewers', () => {
    const open1 = onPlayerOpen(closed);
    const open2 = onPlayerOpen(open1);
    expect(onPlayerClose(open2).open).toBe(true);
  });

  it('barrel never blocked by block above (wiki)', () => {
    // Wiki: "Unlike chests, the action of opening a barrel is never
    // prevented." Same answer regardless of facing or what's above.
    expect(blockedByBlockAbove(closed, 'stone')).toBe(false);
    expect(blockedByBlockAbove({ ...closed, facing: 'north' }, 'stone')).toBe(false);
  });
});
