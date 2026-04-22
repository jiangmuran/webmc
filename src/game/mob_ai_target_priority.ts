// Target priority. Mobs pick among candidate targets using a weighted
// score (proximity + hostility + last-seen-recency).

export interface Candidate {
  id: string;
  distance: number;
  lastSeenMsAgo: number;
  isHostileToMe: boolean;
  isOwnerOfMe: boolean;
  hasAttackedMeRecently: boolean;
}

export function scoreCandidate(c: Candidate): number {
  let s = 0;
  if (c.hasAttackedMeRecently) s += 100;
  if (c.isHostileToMe) s += 50;
  if (c.isOwnerOfMe) s -= 1000;
  s -= c.distance;
  s -= c.lastSeenMsAgo / 1000;
  return s;
}

export function pickTarget(cs: Candidate[]): Candidate | null {
  let best: Candidate | null = null;
  let bestScore = -Infinity;
  for (const c of cs) {
    const s = scoreCandidate(c);
    if (s > bestScore) {
      bestScore = s;
      best = c;
    }
  }
  return best;
}

// Forget target if lastSeenMsAgo > threshold.
export const FORGET_THRESHOLD_MS = 20_000;

export function shouldForget(c: Candidate): boolean {
  return c.lastSeenMsAgo >= FORGET_THRESHOLD_MS;
}
