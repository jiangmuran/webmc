// Weighted spawn picker. Each mob type has a spawn weight per biome;
// pick proportional to weight.

export interface SpawnOption {
  mobId: string;
  weight: number;
  minGroup: number;
  maxGroup: number;
}

export interface PickQuery {
  options: SpawnOption[];
  rand: () => number;
}

export interface PickResult {
  mobId: string;
  groupSize: number;
}

export function pickSpawn(q: PickQuery): PickResult | null {
  const total = q.options.reduce((s, o) => s + o.weight, 0);
  if (total <= 0) return null;
  let r = q.rand() * total;
  for (const o of q.options) {
    r -= o.weight;
    if (r <= 0) {
      const groupSize = o.minGroup + Math.floor(q.rand() * (o.maxGroup - o.minGroup + 1));
      return { mobId: o.mobId, groupSize };
    }
  }
  const last = q.options[q.options.length - 1];
  if (!last) return null;
  return { mobId: last.mobId, groupSize: last.minGroup };
}

// Common biome tables (subset)
export const PLAINS_PASSIVE: SpawnOption[] = [
  { mobId: 'webmc:cow', weight: 8, minGroup: 4, maxGroup: 4 },
  { mobId: 'webmc:sheep', weight: 12, minGroup: 4, maxGroup: 4 },
  { mobId: 'webmc:chicken', weight: 10, minGroup: 4, maxGroup: 4 },
  { mobId: 'webmc:pig', weight: 10, minGroup: 4, maxGroup: 4 },
  { mobId: 'webmc:horse', weight: 5, minGroup: 2, maxGroup: 6 },
];
