// Priority-based AI goal selector. Each tick, the highest-priority goal
// whose predicate returns true becomes the "active" goal. Goals can be
// mutually-exclusive by tag (e.g. "move", "attack") — at most one per tag
// is active at a time. Lower priority value = higher priority (0 = top).

export interface Goal<Ctx> {
  readonly name: string;
  readonly tag: string;
  readonly priority: number;
  canStart(ctx: Ctx): boolean;
  continues(ctx: Ctx): boolean;
  tick(ctx: Ctx, dtSec: number): void;
  onStop?(): void;
}

export class GoalSelector<Ctx> {
  private goals: Goal<Ctx>[] = [];
  private active = new Map<string, Goal<Ctx>>(); // tag → goal

  add(g: Goal<Ctx>): void {
    this.goals.push(g);
    this.goals.sort((a, b) => a.priority - b.priority);
  }

  tick(ctx: Ctx, dtSec: number): void {
    // Stop goals whose continues() is false.
    for (const [tag, g] of this.active) {
      if (!g.continues(ctx)) {
        g.onStop?.();
        this.active.delete(tag);
      }
    }
    // Try to start a higher-priority goal per tag.
    for (const g of this.goals) {
      const cur = this.active.get(g.tag);
      if (cur && cur.priority <= g.priority) continue;
      if (g.canStart(ctx)) {
        if (cur) cur.onStop?.();
        this.active.set(g.tag, g);
      }
    }
    // Tick active goals.
    for (const g of this.active.values()) g.tick(ctx, dtSec);
  }

  activeNames(): string[] {
    return Array.from(this.active.values()).map((g) => g.name);
  }

  isActive(name: string): boolean {
    for (const g of this.active.values()) if (g.name === name) return true;
    return false;
  }

  stopAll(): void {
    for (const g of this.active.values()) g.onStop?.();
    this.active.clear();
  }
}
