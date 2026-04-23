export interface GenRequest {
  cx: number;
  cz: number;
  priority: number;
  requestedAt: number;
}

export function nextRequest(q: GenRequest[]): GenRequest | undefined {
  if (q.length === 0) return undefined;
  return [...q].sort((a, b) => b.priority - a.priority || a.requestedAt - b.requestedAt)[0];
}

export function withoutKey(q: GenRequest[], cx: number, cz: number): GenRequest[] {
  return q.filter((r) => r.cx !== cx || r.cz !== cz);
}

export function deduplicate(q: GenRequest[]): GenRequest[] {
  const seen = new Set<string>();
  const out: GenRequest[] = [];
  for (const r of q) {
    const key = `${r.cx},${r.cz}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(r);
  }
  return out;
}
