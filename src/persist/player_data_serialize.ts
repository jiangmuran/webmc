export interface PersistedPlayer {
  uuid: string;
  name: string;
  pos: [number, number, number];
  yaw: number;
  pitch: number;
  health: number;
  food: number;
  saturation: number;
  xp: number;
  xpLevel: number;
  gameMode: 'survival' | 'creative' | 'adventure' | 'spectator';
}

export const PLAYER_DATA_VERSION = 1;

export interface SerializedPlayer {
  version: number;
  data: PersistedPlayer;
}

export function serialize(p: PersistedPlayer): SerializedPlayer {
  return { version: PLAYER_DATA_VERSION, data: p };
}

export function deserialize(raw: unknown): PersistedPlayer | undefined {
  if (typeof raw !== 'object' || raw === null) return undefined;
  const obj = raw as { version?: number; data?: unknown };
  if (obj.version !== PLAYER_DATA_VERSION) return undefined;
  return obj.data as PersistedPlayer;
}
