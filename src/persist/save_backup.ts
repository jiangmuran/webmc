// Save backup rotation. Keep 5 rolling backups, named save.1..save.5.
// Newest is save.1. Promote on each full autosave.

export interface BackupEntry {
  slot: number; // 1..5 (1 = newest)
  timestampMs: number;
  bytes: number;
}

export const MAX_BACKUPS = 5;

export function rotateBackups(
  list: BackupEntry[],
  newEntry: { timestampMs: number; bytes: number },
): BackupEntry[] {
  const shifted = list
    .map((b) => ({ ...b, slot: b.slot + 1 }))
    .filter((b) => b.slot <= MAX_BACKUPS);
  return [{ slot: 1, timestampMs: newEntry.timestampMs, bytes: newEntry.bytes }, ...shifted].sort(
    (a, b) => a.slot - b.slot,
  );
}

export function pickRestore(list: BackupEntry[], slot: number): BackupEntry | null {
  return list.find((b) => b.slot === slot) ?? null;
}

export function totalBytes(list: BackupEntry[]): number {
  return list.reduce((acc, b) => acc + b.bytes, 0);
}
