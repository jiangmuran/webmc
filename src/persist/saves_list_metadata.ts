export interface SavedWorld {
  name: string;
  lastPlayed: number;
  size: number;
  gameMode: 'survival' | 'creative' | 'adventure' | 'spectator';
  version: number;
}

export function sortByRecent(list: SavedWorld[]): SavedWorld[] {
  return [...list].sort((a, b) => b.lastPlayed - a.lastPlayed);
}

export function totalStorage(list: SavedWorld[]): number {
  return list.reduce((a, w) => a + w.size, 0);
}

export function filter(list: SavedWorld[], q: string): SavedWorld[] {
  const low = q.toLowerCase();
  return list.filter((w) => w.name.toLowerCase().includes(low));
}
