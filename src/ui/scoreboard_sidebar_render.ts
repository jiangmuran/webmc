export interface ScoreLine {
  name: string;
  score: number;
}

export const MAX_SIDEBAR_ENTRIES = 15;

export function displayedEntries(all: readonly ScoreLine[]): readonly ScoreLine[] {
  return [...all].sort((a, b) => b.score - a.score).slice(0, MAX_SIDEBAR_ENTRIES);
}

export function formatLine(line: ScoreLine, maxNameWidth: number, maxScoreWidth: number): string {
  const padded = line.name.padEnd(maxNameWidth);
  const score = String(line.score).padStart(maxScoreWidth);
  return `${padded} ${score}`;
}

export function widestName(entries: readonly ScoreLine[]): number {
  return entries.reduce((m, e) => Math.max(m, e.name.length), 0);
}
