// Player state serialization. A player-save blob captures everything
// needed to resume a session: position, stats, inventory, XP, effects,
// selected slot, gamemode. Versioned so migrations can evolve the schema.

export const PLAYER_SAVE_VERSION = 3;

export interface PlayerSaveV3 {
  version: 3;
  uuid: string;
  name: string;
  dimension: string;
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
  health: number;
  hunger: number;
  saturation: number;
  breath: number;
  xpLevel: number;
  xpProgress: number;
  gamemode: 'survival' | 'creative' | 'adventure' | 'spectator';
  selectedSlot: number;
  inventory: readonly SavedStack[];
  effects: readonly SavedEffect[];
  spawnPoint: { x: number; y: number; z: number; dimension: string } | null;
}

export interface SavedStack {
  slot: number;
  item: string;
  count: number;
  damage: number;
  enchants?: readonly { id: string; level: number }[];
  customName?: string;
}

export interface SavedEffect {
  id: string;
  amplifier: number;
  remainingSec: number;
}

// Default blob for a fresh player.
export function freshPlayer(uuid: string, name: string): PlayerSaveV3 {
  return {
    version: PLAYER_SAVE_VERSION,
    uuid,
    name,
    dimension: 'overworld',
    x: 0,
    y: 64,
    z: 0,
    yaw: 0,
    pitch: 0,
    health: 20,
    hunger: 20,
    saturation: 5,
    breath: 15,
    xpLevel: 0,
    xpProgress: 0,
    gamemode: 'survival',
    selectedSlot: 0,
    inventory: [],
    effects: [],
    spawnPoint: null,
  };
}

export function validatePlayerSave(blob: PlayerSaveV3): string[] {
  const errors: string[] = [];
  const v: number = blob.version;
  if (v !== PLAYER_SAVE_VERSION) {
    errors.push(`version mismatch: ${v} vs ${PLAYER_SAVE_VERSION}`);
  }
  if (blob.health < 0 || blob.health > 20) errors.push(`health out of range: ${blob.health}`);
  if (blob.hunger < 0 || blob.hunger > 20) errors.push(`hunger out of range: ${blob.hunger}`);
  if (blob.selectedSlot < 0 || blob.selectedSlot > 8) {
    errors.push(`selectedSlot out of range: ${blob.selectedSlot}`);
  }
  const slots = new Set<number>();
  for (const s of blob.inventory) {
    if (slots.has(s.slot)) errors.push(`duplicate slot ${s.slot}`);
    slots.add(s.slot);
    if (s.count <= 0) errors.push(`non-positive count in slot ${s.slot}`);
  }
  return errors;
}

// Shallow clone that sorts inventory by slot — useful for deterministic
// equality checks in tests + save-file diffs.
export function canonicalize(blob: PlayerSaveV3): PlayerSaveV3 {
  const inv = [...blob.inventory].sort((a, b) => a.slot - b.slot);
  const fx = [...blob.effects].sort((a, b) => a.id.localeCompare(b.id));
  return { ...blob, inventory: inv, effects: fx };
}
