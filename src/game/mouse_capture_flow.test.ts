import { describe, it, expect } from 'vitest';
import {
  makeLockState,
  tryRequestLock,
  onLocked,
  onUnlocked,
  onEsc,
  REQUEST_COOLDOWN_MS,
} from './mouse_capture_flow';

describe('pointer lock flow', () => {
  it('first request', () => {
    const s = makeLockState();
    expect(tryRequestLock(s, { nowMs: 1000 })).toBe('requested');
  });

  it('cooldown blocks second', () => {
    const s = makeLockState();
    tryRequestLock(s, { nowMs: 1000 });
    expect(tryRequestLock(s, { nowMs: 1500 })).toBe('cooldown');
  });

  it('after cooldown ok', () => {
    const s = makeLockState();
    tryRequestLock(s, { nowMs: 0 });
    expect(tryRequestLock(s, { nowMs: REQUEST_COOLDOWN_MS + 1 })).toBe('requested');
  });

  it('locked blocks', () => {
    const s = makeLockState();
    onLocked(s);
    expect(tryRequestLock(s, { nowMs: 9999 })).toBe('already_locked');
  });

  it('esc allows quick retry', () => {
    const s = makeLockState();
    tryRequestLock(s, { nowMs: 0 });
    onLocked(s);
    onEsc(s, 1000);
    expect(tryRequestLock(s, { nowMs: 1500 })).toBe('requested');
  });

  it('unlock clears', () => {
    const s = makeLockState();
    onLocked(s);
    onUnlocked(s);
    expect(s.locked).toBe(false);
  });
});
