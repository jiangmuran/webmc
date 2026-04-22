import { describe, it, expect } from 'vitest';
import {
  makeSaveState,
  markDirty,
  shouldSave,
  beginSave,
  endSave,
  INTERVAL_MS,
  THRESHOLD_DIRTY,
} from './autosave_debounce';

describe('autosave', () => {
  it('no save when clean', () => {
    const s = makeSaveState();
    expect(shouldSave(s, { nowMs: INTERVAL_MS + 1, trigger: 'timer' })).toBe(false);
  });

  it('interval triggers', () => {
    const s = makeSaveState();
    markDirty(s);
    expect(shouldSave(s, { nowMs: INTERVAL_MS + 1, trigger: 'timer' })).toBe(true);
  });

  it('threshold triggers', () => {
    const s = makeSaveState();
    markDirty(s, THRESHOLD_DIRTY);
    expect(shouldSave(s, { nowMs: 0, trigger: 'threshold' })).toBe(true);
  });

  it('unload even soon', () => {
    const s = makeSaveState();
    markDirty(s);
    expect(shouldSave(s, { nowMs: 0, trigger: 'unload' })).toBe(true);
  });

  it('not while inflight', () => {
    const s = makeSaveState();
    markDirty(s);
    beginSave(s, 0);
    expect(shouldSave(s, { nowMs: INTERVAL_MS + 1, trigger: 'timer' })).toBe(false);
    endSave(s);
  });

  it('beginSave clears dirty', () => {
    const s = makeSaveState();
    markDirty(s, 50);
    beginSave(s, 0);
    expect(s.dirtyCount).toBe(0);
  });
});
