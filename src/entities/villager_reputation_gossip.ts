// Villager gossip reputation. Gossip types have maximum values that
// accumulate per player. Types:
//   major_positive (20/700), minor_positive (25/200),
//   minor_negative (25/200), major_negative (25/10000), trading (2/25).

export type GossipType =
  | 'major_positive'
  | 'minor_positive'
  | 'minor_negative'
  | 'major_negative'
  | 'trading';

const MAX: Record<GossipType, number> = {
  major_positive: 700,
  minor_positive: 200,
  minor_negative: 200,
  major_negative: 10000,
  trading: 25,
};

const PER_EVENT: Record<GossipType, number> = {
  major_positive: 20,
  minor_positive: 25,
  minor_negative: 25,
  major_negative: 25,
  trading: 2,
};

const WEIGHTS: Record<GossipType, number> = {
  major_positive: 5,
  minor_positive: 1,
  minor_negative: -1,
  major_negative: -5,
  trading: 1,
};

const TYPES: GossipType[] = [
  'major_positive',
  'minor_positive',
  'minor_negative',
  'major_negative',
  'trading',
];

export type PlayerGossip = Map<GossipType, number>;
export type GossipByPlayer = Map<string, PlayerGossip>;

export function addGossip(map: GossipByPlayer, playerId: string, type: GossipType): void {
  let g = map.get(playerId);
  if (!g) {
    g = new Map();
    map.set(playerId, g);
  }
  const cur = g.get(type) ?? 0;
  g.set(type, Math.min(MAX[type], cur + PER_EVENT[type]));
}

export function decayDay(map: GossipByPlayer): void {
  for (const g of map.values()) {
    for (const t of TYPES) {
      const v = g.get(t);
      if (v === undefined) continue;
      g.set(t, Math.max(0, v - 2));
    }
  }
}

export function reputation(map: GossipByPlayer, playerId: string): number {
  const g = map.get(playerId);
  if (!g) return 0;
  let r = 0;
  for (const [t, v] of g) r += v * WEIGHTS[t];
  return r;
}
