// Scoreboard objectives. Track integer scores per player per
// objective. Display slot assigns which objective appears in sidebar,
// belowName, or list.

export interface Objective {
  id: string;
  displayName: string;
  criterion: 'dummy' | 'trigger' | 'playerKills' | 'deaths' | 'health';
}

export type DisplaySlot = 'sidebar' | 'list' | 'belowName';

export class Scoreboard {
  private objectives = new Map<string, Objective>();
  private scores = new Map<string, Map<string, number>>(); // obj -> player -> score
  private display = new Map<DisplaySlot, string>();

  addObjective(o: Objective): boolean {
    if (this.objectives.has(o.id)) return false;
    this.objectives.set(o.id, o);
    this.scores.set(o.id, new Map());
    return true;
  }

  removeObjective(id: string): boolean {
    const deleted = this.objectives.delete(id);
    this.scores.delete(id);
    for (const [slot, objId] of this.display) {
      if (objId === id) this.display.delete(slot);
    }
    return deleted;
  }

  setScore(obj: string, player: string, score: number): boolean {
    const map = this.scores.get(obj);
    if (!map) return false;
    map.set(player, score);
    return true;
  }

  getScore(obj: string, player: string): number | null {
    return this.scores.get(obj)?.get(player) ?? null;
  }

  increment(obj: string, player: string, delta = 1): boolean {
    const cur = this.getScore(obj, player) ?? 0;
    return this.setScore(obj, player, cur + delta);
  }

  setDisplay(slot: DisplaySlot, objId: string | null): void {
    if (objId === null) this.display.delete(slot);
    else if (this.objectives.has(objId)) this.display.set(slot, objId);
  }

  displayedFor(slot: DisplaySlot): Objective | null {
    const id = this.display.get(slot);
    return id ? (this.objectives.get(id) ?? null) : null;
  }

  sidebarEntries(): { player: string; score: number }[] {
    const o = this.displayedFor('sidebar');
    if (!o) return [];
    const map = this.scores.get(o.id);
    if (!map) return [];
    return [...map.entries()]
      .map(([player, score]) => ({ player, score }))
      .sort((a, b) => b.score - a.score);
  }
}
