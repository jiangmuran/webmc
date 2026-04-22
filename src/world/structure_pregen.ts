// Pre-gen schedule. Generate an N-chunk radius around spawn when a
// world is first created, in a deterministic order that prioritizes
// the player's likely spawn area.

export interface PregenTask {
  cx: number;
  cz: number;
  priority: number;
}

export interface PregenPlan {
  total: number;
  order: PregenTask[];
}

export function planPregen(radius: number): PregenPlan {
  const tasks: PregenTask[] = [];
  for (let cx = -radius; cx <= radius; cx++) {
    for (let cz = -radius; cz <= radius; cz++) {
      tasks.push({ cx, cz, priority: Math.abs(cx) + Math.abs(cz) });
    }
  }
  tasks.sort((a, b) => a.priority - b.priority);
  return { total: tasks.length, order: tasks };
}

export interface PregenProgress {
  completed: number;
  total: number;
}

export function makeProgress(total: number): PregenProgress {
  return { completed: 0, total };
}

export function markDone(p: PregenProgress, count = 1): void {
  p.completed = Math.min(p.total, p.completed + count);
}

export function percentDone(p: PregenProgress): number {
  if (p.total <= 0) return 1;
  return p.completed / p.total;
}

export function etaSeconds(p: PregenProgress, elapsedSec: number): number {
  if (p.completed <= 0) return Infinity;
  const rate = p.completed / elapsedSec;
  const remaining = p.total - p.completed;
  return remaining / rate;
}
