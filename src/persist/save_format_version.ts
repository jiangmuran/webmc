export interface SaveHeader {
  formatVersion: number;
  gameVersion: string;
  createdAt: number;
  lastPlayedAt: number;
}

export const CURRENT_FORMAT_VERSION = 3;

export function isCompatible(h: SaveHeader): boolean {
  return h.formatVersion <= CURRENT_FORMAT_VERSION && h.formatVersion > 0;
}

export function needsUpgrade(h: SaveHeader): boolean {
  return h.formatVersion < CURRENT_FORMAT_VERSION;
}

export function stamp(h: SaveHeader): SaveHeader {
  return { ...h, formatVersion: CURRENT_FORMAT_VERSION };
}
