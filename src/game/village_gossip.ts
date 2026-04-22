// Village gossip. Tracks per-player reputation within a villager's
// village. Positive actions raise trade discount; negative events reduce it.

export type GossipKind =
  | 'major_positive'
  | 'minor_positive'
  | 'minor_negative'
  | 'major_negative'
  | 'trading';

const KIND_CAPS: Record<GossipKind, number> = {
  major_positive: 100,
  minor_positive: 200,
  minor_negative: 200,
  major_negative: 100,
  trading: 25,
};

const REPUTATION_WEIGHT: Record<GossipKind, number> = {
  major_positive: 5,
  minor_positive: 1,
  trading: 1,
  minor_negative: -1,
  major_negative: -5,
};

export class VillageGossip {
  private readonly scores = new Map<string, Map<GossipKind, number>>();

  add(playerId: string, kind: GossipKind, amount: number): void {
    let by = this.scores.get(playerId);
    if (!by) {
      by = new Map();
      this.scores.set(playerId, by);
    }
    const cur = by.get(kind) ?? 0;
    by.set(kind, Math.min(KIND_CAPS[kind], Math.max(0, cur + amount)));
  }

  reputation(playerId: string): number {
    const by = this.scores.get(playerId);
    if (!by) return 0;
    let total = 0;
    for (const [kind, value] of by) total += value * REPUTATION_WEIGHT[kind];
    return total;
  }

  // Decay (daily). Positives/negatives dim by 1 per in-game day.
  decay(): void {
    for (const by of this.scores.values()) {
      for (const [k, v] of by) {
        const reduced = v > 0 ? v - 1 : v < 0 ? v + 1 : 0;
        by.set(k, reduced);
      }
    }
  }

  // Trade price modifier: % discount/surcharge based on reputation.
  priceModifier(playerId: string): number {
    return Math.max(-0.3, Math.min(0.2, this.reputation(playerId) / 100));
  }
}
