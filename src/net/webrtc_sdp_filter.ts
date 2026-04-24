export function sanitizeSdp(sdp: string): string {
  const lines = sdp.split(/\r?\n/);
  const out: string[] = [];
  for (const line of lines) {
    if (line.startsWith('a=extmap-allow-mixed')) continue;
    if (line.startsWith('a=candidate') && /typ\s+prflx/.test(line)) continue;
    out.push(line);
  }
  return out.join('\r\n');
}

export function isPlainSdp(text: string): boolean {
  return /^v=0\b/m.test(text) && /^m=/m.test(text);
}

export function removeIceCandidatesOfType(
  sdp: string,
  type: 'host' | 'srflx' | 'relay' | 'prflx',
): string {
  return sdp
    .split(/\r?\n/)
    .filter((l) => !(l.startsWith('a=candidate') && l.includes(`typ ${type}`)))
    .join('\r\n');
}
