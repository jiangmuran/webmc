import { describe, it, expect } from 'vitest';
import { stripMdnsCandidates, stripExtensions, hasPayload } from './sdp_sanitize';

describe('sdp sanitize', () => {
  it('strips mdns candidates', () => {
    const sdp = [
      'v=0',
      'a=candidate:1 1 UDP 2122260223 abc.local 56789 typ host',
      'a=candidate:2 1 UDP 2122260223 1.2.3.4 56790 typ host',
    ].join('\n');
    const r = stripMdnsCandidates(sdp);
    expect(r).not.toContain('abc.local');
    expect(r).toContain('1.2.3.4');
  });

  it('strips named extensions', () => {
    const sdp = 'a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level';
    expect(stripExtensions(sdp, ['ietf:params:rtp-hdrext:ssrc-audio-level'])).toBe('');
  });

  it('hasPayload detects', () => {
    expect(hasPayload('a=rtpmap:111 opus/48000', 'opus')).toBe(true);
    expect(hasPayload('', 'opus')).toBe(false);
  });
});
