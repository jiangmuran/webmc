export interface LoadRequest {
  dx: number;
  dz: number;
  requestedAtTick: number;
  priorityOverride?: number;
}

export function priorityScore(r: LoadRequest): number {
  if (r.priorityOverride !== undefined) return r.priorityOverride;
  const dist = r.dx * r.dx + r.dz * r.dz;
  return -dist;
}

export function nextChunk(queue: LoadRequest[]): LoadRequest | undefined {
  if (queue.length === 0) return undefined;
  return [...queue].sort((a, b) => priorityScore(b) - priorityScore(a))[0];
}
