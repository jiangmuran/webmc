import { describe, it, expect } from 'vitest';
import { sanitizeSdp, isPlainSdp, removeIceCandidatesOfType } from './webrtc_sdp_filter';

const sdp = `v=0
o=- 1 1 IN IP4 127.0.0.1
s=-
t=0 0
a=extmap-allow-mixed
m=application 9 DTLS/SCTP 5000
a=candidate:1 1 UDP 2122260223 192.168.0.2 56789 typ host
a=candidate:2 1 UDP 1686052607 203.0.113.1 56789 typ srflx
a=candidate:3 1 UDP 16777215 192.0.2.1 56789 typ relay
`;

describe('webrtc SDP filter', () => {
  it('valid SDP detected', () => {
    expect(isPlainSdp(sdp)).toBe(true);
  });

  it('plain text rejected', () => {
    expect(isPlainSdp('hello world')).toBe(false);
  });

  it('sanitize strips allow-mixed', () => {
    expect(sanitizeSdp(sdp)).not.toContain('extmap-allow-mixed');
  });

  it('remove host candidates', () => {
    const out = removeIceCandidatesOfType(sdp, 'host');
    expect(out).not.toMatch(/typ host/);
    expect(out).toMatch(/typ srflx/);
  });

  it('remove relay candidates', () => {
    const out = removeIceCandidatesOfType(sdp, 'relay');
    expect(out).not.toMatch(/typ relay/);
  });
});
