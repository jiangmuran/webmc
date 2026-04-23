// ICE candidate selection. Prefer host > srflx > relay; within each,
// prefer UDP > TCP. Priority = type*65536 + (udp?100:0) + (ipv4?1:0).

export type CandidateType = 'host' | 'srflx' | 'relay';
export type Transport = 'udp' | 'tcp';

export interface IceCandidate {
  type: CandidateType;
  transport: Transport;
  addressFamily: 'ipv4' | 'ipv6';
  roundtripEstimateMs: number;
}

const TYPE_BASE: Record<CandidateType, number> = {
  host: 3,
  srflx: 2,
  relay: 1,
};

export function priority(c: IceCandidate): number {
  const base = TYPE_BASE[c.type] * 65536;
  const udpBonus = c.transport === 'udp' ? 100 : 0;
  const ipBonus = c.addressFamily === 'ipv4' ? 1 : 0;
  const rtt = Math.max(0, 500 - c.roundtripEstimateMs);
  return base + udpBonus + ipBonus + rtt;
}

export function sortDescendingPriority(list: IceCandidate[]): IceCandidate[] {
  return [...list].sort((a, b) => priority(b) - priority(a));
}
