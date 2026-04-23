// Villager gossip. Each villager carries gossip records about players:
// minor positive, major positive, minor negative, major negative.
// Gossip decays and spreads to nearby villagers.

export type GossipKind =
  | 'minor_positive'
  | 'major_positive'
  | 'minor_negative'
  | 'major_negative'
  | 'trading';

export interface GossipEntry {
  target: string;
  kind: GossipKind;
  value: number;
}

export interface VillagerGossip {
  entries: GossipEntry[];
}

export const MAX_VALUE: Record<GossipKind, number> = {
  minor_positive: 200,
  major_positive: 20,
  minor_negative: 200,
  major_negative: 100,
  trading: 25,
};

export function addGossip(
  v: VillagerGossip,
  kind: GossipKind,
  target: string,
  amount: number,
): void {
  const existing = v.entries.find((e) => e.target === target && e.kind === kind);
  const cap = MAX_VALUE[kind];
  if (existing) {
    existing.value = Math.min(cap, existing.value + amount);
  } else {
    v.entries.push({ target, kind, value: Math.min(cap, amount) });
  }
}

export function reputationTowards(v: VillagerGossip, target: string): number {
  let score = 0;
  for (const e of v.entries) {
    if (e.target !== target) continue;
    const sign = e.kind.includes('positive') || e.kind === 'trading' ? 1 : -1;
    const weight = e.kind.includes('major') ? 5 : 1;
    score += sign * weight * e.value;
  }
  return score;
}

export function decay(v: VillagerGossip, rate = 2): void {
  for (const e of v.entries) e.value = Math.max(0, e.value - rate);
  v.entries = v.entries.filter((e) => e.value > 0);
}
