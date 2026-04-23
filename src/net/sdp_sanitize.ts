// SDP sanitizer. Filters known-sensitive lines before sending SDP
// over the signaling channel. Strips a=candidate: lines with mDNS
// hostnames we don't want to leak.

export function stripMdnsCandidates(sdp: string): string {
  return sdp
    .split('\n')
    .filter((l) => !(l.startsWith('a=candidate:') && l.includes('.local')))
    .join('\n');
}

export function stripExtensions(sdp: string, extensions: string[]): string {
  return sdp
    .split('\n')
    .filter((l) => !extensions.some((e) => l.includes(`urn:${e}`)))
    .join('\n');
}

export function hasPayload(sdp: string, payloadName: string): boolean {
  return sdp.includes(`a=rtpmap:${payloadName}`) || sdp.includes(payloadName);
}
