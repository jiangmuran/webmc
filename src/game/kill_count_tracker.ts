export interface Stats {
  kills: Record<string, number>;
  deaths: number;
  distanceWalked: number;
  timePlayedTicks: number;
}

export function recordKill(s: Stats, mob: string): Stats {
  const kills = { ...s.kills, [mob]: (s.kills[mob] ?? 0) + 1 };
  return { ...s, kills };
}

export function totalKills(s: Stats): number {
  return Object.values(s.kills).reduce((a, b) => a + b, 0);
}

export function killsOf(s: Stats, mob: string): number {
  return s.kills[mob] ?? 0;
}
