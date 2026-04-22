// Scoreboard display slots: list (tab), sidebar, below_name + colored
// team variants. A scoreboard objective can be assigned to at most one
// slot at a time.

export type DisplaySlot =
  | 'list'
  | 'sidebar'
  | 'below_name'
  | 'sidebar_team_white'
  | 'sidebar_team_red'
  | 'sidebar_team_green'
  | 'sidebar_team_blue'
  | 'sidebar_team_yellow';

export class DisplayRegistry {
  private readonly bySlot = new Map<DisplaySlot, string>();

  setObjective(slot: DisplaySlot, objectiveId: string | null): void {
    if (objectiveId === null) this.bySlot.delete(slot);
    else this.bySlot.set(slot, objectiveId);
  }

  objectiveFor(slot: DisplaySlot): string | null {
    return this.bySlot.get(slot) ?? null;
  }

  allAssignments(): readonly { slot: DisplaySlot; objectiveId: string }[] {
    return Array.from(this.bySlot, ([slot, objectiveId]) => ({ slot, objectiveId }));
  }
}
