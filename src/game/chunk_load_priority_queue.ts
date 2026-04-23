export interface ChunkRequest {
  cx: number;
  cz: number;
  playerDistance: number;
  priority: number;
  isVisible: boolean;
}

export function rankedOrder(requests: readonly ChunkRequest[]): readonly ChunkRequest[] {
  return [...requests].sort((a, b) => {
    if (a.isVisible !== b.isVisible) return a.isVisible ? -1 : 1;
    if (a.priority !== b.priority) return b.priority - a.priority;
    return a.playerDistance - b.playerDistance;
  });
}

export function pickBatch(
  requests: readonly ChunkRequest[],
  maxBatch: number,
): readonly ChunkRequest[] {
  return rankedOrder(requests).slice(0, Math.max(0, maxBatch));
}
