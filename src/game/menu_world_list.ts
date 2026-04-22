// World list menu. Shows saved worlds with their name, last-played
// timestamp, gamemode, and difficulty. Supports sort, delete, rename,
// import, export, and "backup before opening".

import type { WorldMetadataV2 } from '@/persist/world_metadata';

export type SortBy = 'last_played' | 'name' | 'created';
export type SortDirection = 'asc' | 'desc';

export interface WorldEntry {
  id: string;
  metadata: WorldMetadataV2;
  sizeBytes: number;
  screenshot: string | null; // base64 thumbnail
  locked: boolean; // opened by another tab / device
}

export interface WorldListState {
  worlds: WorldEntry[];
  sortBy: SortBy;
  direction: SortDirection;
  searchQuery: string;
}

export function makeWorldListState(): WorldListState {
  return {
    worlds: [],
    sortBy: 'last_played',
    direction: 'desc',
    searchQuery: '',
  };
}

export function sortedWorlds(state: WorldListState): WorldEntry[] {
  const filtered =
    state.searchQuery.length > 0
      ? state.worlds.filter((w) =>
          w.metadata.name.toLowerCase().includes(state.searchQuery.toLowerCase()),
        )
      : state.worlds;
  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    switch (state.sortBy) {
      case 'last_played':
        cmp = a.metadata.lastPlayedAt - b.metadata.lastPlayedAt;
        break;
      case 'name':
        cmp = a.metadata.name.localeCompare(b.metadata.name);
        break;
      case 'created':
        cmp = a.metadata.createdAt - b.metadata.createdAt;
        break;
    }
    return state.direction === 'asc' ? cmp : -cmp;
  });
  return sorted;
}

export interface DeleteResult {
  deleted: boolean;
  wasLocked: boolean;
}

export function deleteWorld(state: WorldListState, id: string): DeleteResult {
  const w = state.worlds.find((x) => x.id === id);
  if (!w) return { deleted: false, wasLocked: false };
  if (w.locked) return { deleted: false, wasLocked: true };
  state.worlds = state.worlds.filter((x) => x.id !== id);
  return { deleted: true, wasLocked: false };
}

export function setSort(state: WorldListState, by: SortBy, dir?: SortDirection): void {
  state.sortBy = by;
  if (dir) state.direction = dir;
  else if (state.sortBy === by) {
    state.direction = state.direction === 'asc' ? 'desc' : 'asc';
  }
}

// Confirmation flag for dangerous ops.
export function requiresConfirmation(op: 'delete' | 'overwrite' | 'restore'): boolean {
  return op === 'delete' || op === 'overwrite';
}
