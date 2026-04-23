export type GossipKind = 'minor_positive' | 'major_positive' | 'minor_negative' | 'major_negative' | 'trading';

export interface GossipEntry {
  about: string;
  kind: GossipKind;
  weight: number;
}

export const DECAY_PER_DAY = 2;

export function decayOneDay(g: GossipEntry[]): GossipEntry[] {
  return g
    .map((e) => ({ ...e, weight: Math.max(0, e.weight - DECAY_PER_DAY) }))
    .filter((e) => e.weight > 0);
}

export function reputationScoreFor(g: GossipEntry[], about: string): number {
  let score = 0;
  for (const e of g) {
    if (e.about !== about) continue;
    if (e.kind === 'major_positive') score += e.weight * 5;
    else if (e.kind === 'minor_positive') score += e.weight * 1;
    else if (e.kind === 'trading') score += e.weight * 1;
    else if (e.kind === 'minor_negative') score -= e.weight * 1;
    else if (e.kind === 'major_negative') score -= e.weight * 5;
  }
  return score;
}
