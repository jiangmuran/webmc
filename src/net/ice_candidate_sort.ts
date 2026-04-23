export type CandidateType = 'host' | 'srflx' | 'prflx' | 'relay';

export interface Candidate {
  type: CandidateType;
  priority: number;
  foundation: string;
}

export const TYPE_PRIORITY: Record<CandidateType, number> = {
  host: 126,
  prflx: 110,
  srflx: 100,
  relay: 0,
};

export function sorted(candidates: Candidate[]): Candidate[] {
  return [...candidates].sort((a, b) => {
    const diff = TYPE_PRIORITY[b.type] - TYPE_PRIORITY[a.type];
    if (diff !== 0) return diff;
    return b.priority - a.priority;
  });
}

export function preferredTransport(c: Candidate[]): 'direct' | 'relay' {
  const best = sorted(c)[0];
  if (!best) return 'relay';
  return best.type === 'relay' ? 'relay' : 'direct';
}
