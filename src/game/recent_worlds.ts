// Recent worlds list. Displayed on title screen; stores up to 8 entries.

export interface RecentWorld {
  name: string;
  seed: string;
  lastPlayedMs: number;
  sizeBytes: number;
}

export const MAX_RECENT = 8;

export function push(list: RecentWorld[], w: RecentWorld): RecentWorld[] {
  const filtered = list.filter((e) => e.name !== w.name);
  filtered.unshift(w);
  return filtered.slice(0, MAX_RECENT);
}

export function sortByRecency(list: RecentWorld[]): RecentWorld[] {
  return [...list].sort((a, b) => b.lastPlayedMs - a.lastPlayedMs);
}

export function totalSizeBytes(list: RecentWorld[]): number {
  return list.reduce((s, w) => s + w.sizeBytes, 0);
}

export function find(list: RecentWorld[], name: string): RecentWorld | null {
  return list.find((w) => w.name === name) ?? null;
}
