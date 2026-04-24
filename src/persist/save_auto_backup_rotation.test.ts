import { describe, it, expect } from 'vitest';
import {
  nextBackupSlot,
  dueForAutoBackup,
  prune,
  MAX_AUTO_BACKUPS,
  MIN_AUTO_INTERVAL_MS,
  type BackupSlot,
} from './save_auto_backup_rotation';

function mk(slot: number, t: number): BackupSlot {
  return { slot, createdAtMs: t, sizeBytes: 100, triggeredBy: 'auto' };
}

describe('save auto backup rotation', () => {
  it('empty returns 0', () => {
    expect(nextBackupSlot([])).toBe(0);
  });

  it('fills missing slot', () => {
    expect(nextBackupSlot([mk(0, 0), mk(2, 0)])).toBe(1);
  });

  it('overwrites oldest when full', () => {
    const full = Array.from({ length: MAX_AUTO_BACKUPS }, (_, i) => mk(i, 1000 + i));
    expect(nextBackupSlot(full)).toBe(0);
  });

  it('due after interval', () => {
    expect(dueForAutoBackup(0, MIN_AUTO_INTERVAL_MS)).toBe(true);
  });

  it('not due too soon', () => {
    expect(dueForAutoBackup(0, 100)).toBe(false);
  });

  it('prune keeps recent', () => {
    const over = Array.from({ length: 10 }, (_, i) => mk(i, 1000 + i));
    expect(prune(over).length).toBe(MAX_AUTO_BACKUPS);
  });
});
