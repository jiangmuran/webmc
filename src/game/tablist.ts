// Tab list (player scoreboard). Press Tab to show the list: each row
// has name, ping bars, team prefix/suffix, gamemode icon, and optional
// scoreboard objective value.

import type { SignalDisplay } from './ping_indicator';

export interface TablistEntry {
  uuid: string;
  name: string;
  gamemode: 'survival' | 'creative' | 'adventure' | 'spectator';
  signal: SignalDisplay;
  teamPrefix: string;
  teamSuffix: string;
  objectiveScore: number | null;
  listed: boolean; // some players are hidden (e.g. via /team option)
}

export class Tablist {
  private readonly entries = new Map<string, TablistEntry>();
  private header = '';
  private footer = '';

  setHeaderFooter(header: string, footer: string): void {
    this.header = header;
    this.footer = footer;
  }

  getHeader(): string {
    return this.header;
  }

  getFooter(): string {
    return this.footer;
  }

  upsert(entry: TablistEntry): void {
    this.entries.set(entry.uuid, entry);
  }

  remove(uuid: string): boolean {
    return this.entries.delete(uuid);
  }

  get(uuid: string): TablistEntry | null {
    return this.entries.get(uuid) ?? null;
  }

  listedEntries(): TablistEntry[] {
    const visible = Array.from(this.entries.values()).filter((e) => e.listed);
    visible.sort((a, b) => a.name.localeCompare(b.name));
    return visible;
  }

  size(): number {
    return this.entries.size;
  }
}

// When the objective has "sort by score", override alphabetical order.
export function sortByScoreDescending(entries: TablistEntry[]): TablistEntry[] {
  return [...entries].sort((a, b) => {
    const sa = a.objectiveScore ?? 0;
    const sb = b.objectiveScore ?? 0;
    if (sa !== sb) return sb - sa;
    return a.name.localeCompare(b.name);
  });
}

// Format a row for rendering.
export function renderRow(entry: TablistEntry): string {
  const score = entry.objectiveScore !== null ? ` [${entry.objectiveScore.toString()}]` : '';
  return `${entry.teamPrefix}${entry.name}${entry.teamSuffix}${score}`;
}
