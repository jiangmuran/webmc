export interface CriterionResult {
  id: string;
  achievedAt?: number;
}

export interface AdvancementDef {
  id: string;
  requires: string[][];
}

export function satisfied(def: AdvancementDef, results: CriterionResult[]): boolean {
  const done = new Set(results.filter((r) => r.achievedAt !== undefined).map((r) => r.id));
  return def.requires.every((group) => group.some((id) => done.has(id)));
}

export function nextMissing(def: AdvancementDef, results: CriterionResult[]): string[] {
  const done = new Set(results.filter((r) => r.achievedAt !== undefined).map((r) => r.id));
  const missing: string[] = [];
  for (const group of def.requires) {
    if (!group.some((id) => done.has(id))) {
      for (const id of group) if (!done.has(id)) missing.push(id);
    }
  }
  return missing;
}
