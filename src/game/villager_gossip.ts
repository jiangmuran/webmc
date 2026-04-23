export type GossipKind =
  | 'minor_positive'
  | 'major_positive'
  | 'minor_negative'
  | 'major_negative'
  | 'trading';

const CAPS: Record<GossipKind, number> = {
  minor_positive: 200,
  major_positive: 20,
  minor_negative: 200,
  major_negative: 25,
  trading: 25,
};

const DECAYS_PER_DAY: Record<GossipKind, number> = {
  minor_positive: 20,
  major_positive: 0,
  minor_negative: 20,
  major_negative: 0,
  trading: 2,
};

export type GossipMap = Record<GossipKind, number>;

export function empty(): GossipMap {
  return {
    minor_positive: 0,
    major_positive: 0,
    minor_negative: 0,
    major_negative: 0,
    trading: 0,
  };
}

export function addEvent(g: GossipMap, kind: GossipKind, amount: number): GossipMap {
  return { ...g, [kind]: Math.min(CAPS[kind], g[kind] + amount) };
}

export function decayOneDay(g: GossipMap): GossipMap {
  const out: GossipMap = { ...g };
  for (const k of Object.keys(DECAYS_PER_DAY) as GossipKind[]) {
    out[k] = Math.max(0, out[k] - DECAYS_PER_DAY[k]);
  }
  return out;
}

export function reputation(g: GossipMap): number {
  return (
    g.major_positive * 5 + g.minor_positive + g.trading - g.minor_negative - g.major_negative * 5
  );
}
