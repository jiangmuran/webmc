export interface Stat {
  id: string;
  value: number;
}

export interface StatsSnapshot {
  general: Stat[];
  mobKills: Record<string, number>;
  itemsUsed: Record<string, number>;
}

export function totalMobKills(s: StatsSnapshot): number {
  return Object.values(s.mobKills).reduce((a, b) => a + b, 0);
}

export function topCategory(
  record: Record<string, number>,
  limit = 5,
): { id: string; value: number }[] {
  return Object.entries(record)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id, value]) => ({ id, value }));
}
