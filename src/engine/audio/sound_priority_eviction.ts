export interface SoundInstance {
  id: string;
  priority: number;
  volume: number;
  startedAtMs: number;
  isPositional: boolean;
}

export const MAX_CONCURRENT = 32;

export function shouldEvictForNew(
  active: readonly SoundInstance[],
  incomingPriority: number,
): { evict?: SoundInstance; ok: boolean } {
  if (active.length < MAX_CONCURRENT) return { ok: true };
  let lowest = active[0];
  for (const s of active) {
    if (lowest === undefined) {
      lowest = s;
      continue;
    }
    if (s.priority < lowest.priority) lowest = s;
    else if (s.priority === lowest.priority && s.volume < lowest.volume) lowest = s;
  }
  if (lowest !== undefined && lowest.priority < incomingPriority)
    return { evict: lowest, ok: true };
  return { ok: false };
}
