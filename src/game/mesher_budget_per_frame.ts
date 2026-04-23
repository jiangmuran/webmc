export interface MeshWork {
  cx: number;
  cz: number;
  cost: number;
}

export const DEFAULT_FRAME_BUDGET = 6;

export function pickChunksForFrame(
  queue: readonly MeshWork[],
  budgetMs = DEFAULT_FRAME_BUDGET,
): { chosen: MeshWork[]; consumed: number } {
  let consumed = 0;
  const chosen: MeshWork[] = [];
  for (const w of queue) {
    if (consumed + w.cost > budgetMs) break;
    chosen.push(w);
    consumed += w.cost;
  }
  return { chosen, consumed };
}

export function chunksLeft(queue: readonly MeshWork[], chosen: readonly MeshWork[]): number {
  return queue.length - chosen.length;
}
