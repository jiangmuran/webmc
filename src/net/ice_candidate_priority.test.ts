import { describe, it, expect } from 'vitest';
import { priority, sortDescendingPriority, type IceCandidate } from './ice_candidate_priority';

const host: IceCandidate = {
  type: 'host',
  transport: 'udp',
  addressFamily: 'ipv4',
  roundtripEstimateMs: 10,
};
const relay: IceCandidate = {
  type: 'relay',
  transport: 'udp',
  addressFamily: 'ipv4',
  roundtripEstimateMs: 50,
};
const srflx: IceCandidate = {
  type: 'srflx',
  transport: 'tcp',
  addressFamily: 'ipv6',
  roundtripEstimateMs: 30,
};

describe('ice candidate priority', () => {
  it('host highest', () => {
    expect(priority(host)).toBeGreaterThan(priority(srflx));
    expect(priority(srflx)).toBeGreaterThan(priority(relay));
  });

  it('sort descending', () => {
    const s = sortDescendingPriority([relay, host, srflx]);
    expect(s[0]).toBe(host);
    expect(s[2]).toBe(relay);
  });

  it('udp beats tcp within type', () => {
    const hostTcp: IceCandidate = { ...host, transport: 'tcp' };
    expect(priority(host)).toBeGreaterThan(priority(hostTcp));
  });
});
