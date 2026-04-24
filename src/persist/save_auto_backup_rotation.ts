export interface BackupSlot {
  slot: number;
  createdAtMs: number;
  sizeBytes: number;
  triggeredBy: 'auto' | 'manual' | 'crash';
}

export const MAX_AUTO_BACKUPS = 5;
export const MIN_AUTO_INTERVAL_MS = 15 * 60 * 1000;

export function nextBackupSlot(existing: readonly BackupSlot[]): number {
  const slots = existing.map((s) => s.slot);
  for (let i = 0; i < MAX_AUTO_BACKUPS; i++) {
    if (!slots.includes(i)) return i;
  }
  const oldest = existing.reduce((a, b) => (a.createdAtMs < b.createdAtMs ? a : b));
  return oldest.slot;
}

export function dueForAutoBackup(lastAutoMs: number, nowMs: number): boolean {
  return nowMs - lastAutoMs >= MIN_AUTO_INTERVAL_MS;
}

export function prune(existing: readonly BackupSlot[]): readonly BackupSlot[] {
  if (existing.length <= MAX_AUTO_BACKUPS) return existing;
  return [...existing].sort((a, b) => b.createdAtMs - a.createdAtMs).slice(0, MAX_AUTO_BACKUPS);
}
