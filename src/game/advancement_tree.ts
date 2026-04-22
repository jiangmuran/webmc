// Advancement tree. Each advancement belongs to a tab ("minecraft", "nether",
// "end", "adventure", "husbandry"), has parent dependencies, and
// criteria that must all be met. Completing an advancement displays a
// toast and awards any configured XP.

export type AdvancementTab = 'root' | 'nether' | 'end' | 'adventure' | 'husbandry';

export interface Advancement {
  id: string;
  tab: AdvancementTab;
  parent: string | null; // id of parent advancement
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  hidden: boolean; // only shown after completion
  criteria: readonly string[]; // trigger ids that must fire
}

export class AdvancementTree {
  private readonly byId = new Map<string, Advancement>();

  register(a: Advancement): void {
    if (this.byId.has(a.id)) throw new Error(`duplicate advancement: ${a.id}`);
    if (a.parent && !this.byId.has(a.parent)) {
      throw new Error(`missing parent ${a.parent} for ${a.id}`);
    }
    this.byId.set(a.id, a);
  }

  get(id: string): Advancement | null {
    return this.byId.get(id) ?? null;
  }

  rootsOf(tab: AdvancementTab): Advancement[] {
    return Array.from(this.byId.values()).filter((a) => a.parent === null && a.tab === tab);
  }

  childrenOf(id: string): Advancement[] {
    return Array.from(this.byId.values()).filter((a) => a.parent === id);
  }

  depthOf(id: string): number {
    let depth = 0;
    let cur = this.byId.get(id);
    while (cur?.parent) {
      depth++;
      cur = this.byId.get(cur.parent);
      if (depth > 100) break; // cycle safety
    }
    return depth;
  }
}

// Player progress: per-player advancement completion state.
export interface PlayerAdvancements {
  completed: Set<string>;
  criteriaFired: Map<string, Set<string>>;
}

export function makePlayerAdvancements(): PlayerAdvancements {
  return { completed: new Set(), criteriaFired: new Map() };
}

export interface CriterionFireResult {
  advancementCompleted: boolean;
  advancementId: string;
}

export function fireCriterion(
  progress: PlayerAdvancements,
  tree: AdvancementTree,
  advancementId: string,
  criterionId: string,
): CriterionFireResult {
  const adv = tree.get(advancementId);
  if (!adv || progress.completed.has(advancementId)) {
    return { advancementCompleted: false, advancementId };
  }
  let set = progress.criteriaFired.get(advancementId);
  if (!set) {
    set = new Set();
    progress.criteriaFired.set(advancementId, set);
  }
  set.add(criterionId);
  const fired = set;
  const allDone = adv.criteria.every((c) => fired.has(c));
  if (allDone) {
    progress.completed.add(advancementId);
    return { advancementCompleted: true, advancementId };
  }
  return { advancementCompleted: false, advancementId };
}
