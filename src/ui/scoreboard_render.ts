export interface Row {
  name: string;
  score: number;
}

export function sortedRows(rows: Row[]): Row[] {
  return [...rows].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}

export const MAX_DISPLAYED = 15;

export function topRows(rows: Row[]): Row[] {
  return sortedRows(rows).slice(0, MAX_DISPLAYED);
}

export function displayName(r: Row): string {
  return `${r.name}: ${r.score}`;
}
