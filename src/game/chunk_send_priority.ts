// Chunk-send priority. Serves closer chunks first, but applies a
// "movement prediction" bump: chunks ahead of player movement get
// slightly higher priority.

export interface SendCandidate {
  cx: number;
  cz: number;
  player: { cx: number; cz: number; vx: number; vz: number };
}

export function priorityScore(c: SendCandidate): number {
  const dx = c.cx - c.player.cx;
  const dz = c.cz - c.player.cz;
  const dist = Math.sqrt(dx * dx + dz * dz);
  // bias: dot product of (dx, dz) with player velocity (normalized).
  const vlen = Math.sqrt(c.player.vx * c.player.vx + c.player.vz * c.player.vz);
  let bias = 0;
  if (vlen > 0 && dist > 0) {
    const dot = (dx * c.player.vx + dz * c.player.vz) / (dist * vlen);
    bias = dot * 2; // 0..2 blocks worth of priority
  }
  return -dist + bias;
}

export interface Queue {
  entries: SendCandidate[];
}

export function sortQueue(q: Queue): SendCandidate[] {
  return [...q.entries].sort((a, b) => priorityScore(b) - priorityScore(a));
}

export function popBest(q: Queue): SendCandidate | null {
  if (q.entries.length === 0) return null;
  let bestIdx = 0;
  let bestScore = -Infinity;
  for (let i = 0; i < q.entries.length; i++) {
    const e = q.entries[i];
    if (!e) continue;
    const s = priorityScore(e);
    if (s > bestScore) {
      bestScore = s;
      bestIdx = i;
    }
  }
  const [c] = q.entries.splice(bestIdx, 1);
  return c ?? null;
}
