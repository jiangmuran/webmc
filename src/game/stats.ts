// Stats tracker — raw integer counters for "distance walked", "blocks
// mined", "items crafted", etc. Distinct from advancements (discrete
// milestones); feeds pause-screen stats + some advancements that want
// cumulative progress ("walk 10 000 m").

export type StatKind =
  | 'distance_walked'
  | 'distance_swum'
  | 'distance_flown'
  | 'distance_sprinted'
  | 'blocks_mined'
  | 'items_crafted'
  | 'items_smelted'
  | 'mobs_killed'
  | 'times_died'
  | 'play_time_sec'
  | 'damage_dealt'
  | 'damage_taken';

export class StatsTracker {
  private readonly counters = new Map<StatKind, number>();
  private readonly blockBreakdowns = new Map<string, number>(); // blockName → break count
  private readonly killBreakdowns = new Map<string, number>(); // mobKind → kill count

  inc(kind: StatKind, by = 1): void {
    this.counters.set(kind, (this.counters.get(kind) ?? 0) + by);
  }

  incBlock(blockName: string): void {
    this.inc('blocks_mined');
    this.blockBreakdowns.set(blockName, (this.blockBreakdowns.get(blockName) ?? 0) + 1);
  }

  incKill(mobKind: string): void {
    this.inc('mobs_killed');
    this.killBreakdowns.set(mobKind, (this.killBreakdowns.get(mobKind) ?? 0) + 1);
  }

  get(kind: StatKind): number {
    return this.counters.get(kind) ?? 0;
  }

  blocksMined(name: string): number {
    return this.blockBreakdowns.get(name) ?? 0;
  }

  mobsKilled(name: string): number {
    return this.killBreakdowns.get(name) ?? 0;
  }

  serialize(): {
    counters: Record<string, number>;
    blocks: Record<string, number>;
    mobs: Record<string, number>;
  } {
    return {
      counters: Object.fromEntries(this.counters),
      blocks: Object.fromEntries(this.blockBreakdowns),
      mobs: Object.fromEntries(this.killBreakdowns),
    };
  }

  hydrate(data: {
    counters?: Record<string, number>;
    blocks?: Record<string, number>;
    mobs?: Record<string, number>;
  }): void {
    for (const [k, v] of Object.entries(data.counters ?? {})) {
      this.counters.set(k as StatKind, v);
    }
    for (const [k, v] of Object.entries(data.blocks ?? {})) this.blockBreakdowns.set(k, v);
    for (const [k, v] of Object.entries(data.mobs ?? {})) this.killBreakdowns.set(k, v);
  }
}
