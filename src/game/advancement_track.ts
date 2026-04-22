// Advancement tracker. Triggers fire based on gameplay events; each
// triggers sets a criterion; when all criteria for an advancement are
// met, it is granted. Parent advancements unlock children.

export interface AdvancementDef {
  id: string;
  parent: string | null;
  criteria: string[]; // criterion ids
}

export interface PlayerProgress {
  granted: Set<string>;
  criteriaMet: Map<string, Set<string>>; // advId → criterion set
}

export function makeProgress(): PlayerProgress {
  return { granted: new Set(), criteriaMet: new Map() };
}

export function fireCriterion(
  defs: Map<string, AdvancementDef>,
  progress: PlayerProgress,
  advId: string,
  criterion: string,
): boolean {
  const def = defs.get(advId);
  if (!def) return false;
  if (progress.granted.has(advId)) return false;
  if (!def.criteria.includes(criterion)) return false;
  let set = progress.criteriaMet.get(advId);
  if (!set) {
    set = new Set();
    progress.criteriaMet.set(advId, set);
  }
  set.add(criterion);
  if (def.criteria.every((c) => set.has(c))) {
    progress.granted.add(advId);
    return true; // just granted
  }
  return false;
}

export function isVisible(
  defs: Map<string, AdvancementDef>,
  progress: PlayerProgress,
  advId: string,
): boolean {
  const def = defs.get(advId);
  if (!def) return false;
  if (def.parent === null) return true;
  return progress.granted.has(def.parent);
}
