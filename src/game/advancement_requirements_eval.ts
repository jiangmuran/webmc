export type Criterion =
  | { kind: 'kill'; entityId: string }
  | { kind: 'obtain'; itemId: string }
  | { kind: 'craft'; itemId: string }
  | { kind: 'enter_dim'; dim: 'overworld' | 'nether' | 'end' }
  | { kind: 'location'; biome: string };

export interface Advancement {
  id: string;
  criteria: readonly Criterion[];
  any: boolean;
}

export interface PlayerFlags {
  kills: ReadonlySet<string>;
  obtained: ReadonlySet<string>;
  crafted: ReadonlySet<string>;
  dimensionsEntered: ReadonlySet<string>;
  biomesVisited: ReadonlySet<string>;
}

export function criterionMet(c: Criterion, p: PlayerFlags): boolean {
  switch (c.kind) {
    case 'kill':
      return p.kills.has(c.entityId);
    case 'obtain':
      return p.obtained.has(c.itemId);
    case 'craft':
      return p.crafted.has(c.itemId);
    case 'enter_dim':
      return p.dimensionsEntered.has(c.dim);
    case 'location':
      return p.biomesVisited.has(c.biome);
  }
}

export function isComplete(a: Advancement, p: PlayerFlags): boolean {
  if (a.criteria.length === 0) return false;
  const predicate = (c: Criterion): boolean => criterionMet(c, p);
  return a.any ? a.criteria.some(predicate) : a.criteria.every(predicate);
}
