export interface BanEntry {
  uuid: string;
  reason: string;
  untilEpochMs?: number;
}

export function isBanned(list: BanEntry[], uuid: string, nowMs: number): boolean {
  const entry = list.find((e) => e.uuid === uuid);
  if (!entry) return false;
  if (entry.untilEpochMs === undefined) return true;
  return nowMs < entry.untilEpochMs;
}

export function ban(
  list: BanEntry[],
  uuid: string,
  reason: string,
  untilEpochMs?: number,
): BanEntry[] {
  const withoutOld = list.filter((e) => e.uuid !== uuid);
  return [...withoutOld, untilEpochMs === undefined ? { uuid, reason } : { uuid, reason, untilEpochMs }];
}

export function unban(list: BanEntry[], uuid: string): BanEntry[] {
  return list.filter((e) => e.uuid !== uuid);
}
