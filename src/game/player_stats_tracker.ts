// Player statistics tracker. Running tally of events: blocks mined,
// mobs killed, distance walked, deaths, etc. Displayed in /stats and
// saved in player data.

export type StatKey =
  | 'blocks_mined'
  | 'mobs_killed'
  | 'distance_walked_cm'
  | 'distance_sprint_cm'
  | 'distance_climb_cm'
  | 'distance_fly_cm'
  | 'deaths'
  | 'jumps'
  | 'time_played_ticks'
  | 'damage_dealt_x10'
  | 'damage_taken_x10'
  | 'items_crafted'
  | 'items_used'
  | 'items_broken'
  | 'treasure_fished';

export class StatTracker {
  private counts: Partial<Record<StatKey, number>> = {};

  add(k: StatKey, delta = 1): void {
    this.counts[k] = (this.counts[k] ?? 0) + delta;
  }

  get(k: StatKey): number {
    return this.counts[k] ?? 0;
  }

  snapshot(): Record<string, number> {
    return { ...this.counts };
  }

  load(from: Record<string, number>): void {
    this.counts = { ...from };
  }

  reset(): void {
    this.counts = {};
  }
}
