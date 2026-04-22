// Save backup rotation. Maintain the last N full saves in a rolling
// buffer keyed by timestamp.

export interface BackupEntry {
  timestampMs: number;
  bytes: number;
  id: string;
}

export interface BackupRing {
  entries: BackupEntry[];
  maxEntries: number;
}

export function makeRing(maxEntries = 5): BackupRing {
  return { entries: [], maxEntries };
}

export function addBackup(r: BackupRing, e: BackupEntry): BackupEntry | null {
  r.entries.push(e);
  r.entries.sort((a, b) => a.timestampMs - b.timestampMs);
  if (r.entries.length > r.maxEntries) {
    return r.entries.shift() ?? null;
  }
  return null;
}

export function latest(r: BackupRing): BackupEntry | null {
  return r.entries[r.entries.length - 1] ?? null;
}

export function totalBytes(r: BackupRing): number {
  return r.entries.reduce((s, e) => s + e.bytes, 0);
}

// Deduplicate by id (in case of retries).
export function uniqueById(r: BackupRing): BackupEntry[] {
  const seen = new Set<string>();
  const out: BackupEntry[] = [];
  for (const e of r.entries) {
    if (seen.has(e.id)) continue;
    seen.add(e.id);
    out.push(e);
  }
  return out;
}
