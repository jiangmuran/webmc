// Tab list (press Tab): lists online players with ping bars, optional
// decorations (team prefix, admin star). Shows the server header/footer.

export interface TabListEntry {
  name: string;
  pingMs: number;
  displayNamePrefix: string;
  isAdmin: boolean;
}

export interface TabListFrame {
  header: string;
  footer: string;
  entries: TabListEntry[];
}

export function pingBars(ms: number): 1 | 2 | 3 | 4 | 5 {
  if (ms < 80) return 5;
  if (ms < 150) return 4;
  if (ms < 250) return 3;
  if (ms < 400) return 2;
  return 1;
}

export function sortEntries(entries: TabListEntry[]): TabListEntry[] {
  return [...entries].sort((a, b) => {
    if (a.isAdmin !== b.isAdmin) return a.isAdmin ? -1 : 1;
    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
  });
}

export function renderLine(e: TabListEntry): string {
  const admin = e.isAdmin ? '★ ' : '';
  const bars = '▂▄▆█'.slice(0, pingBars(e.pingMs) - 1);
  return `${admin}${e.displayNamePrefix}${e.name} ${bars}`;
}
