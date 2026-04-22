// Beacon effects. A beacon's power (1-4) depends on the size of the
// pyramid of valid mineral blocks below it. The beacon applies its primary
// (and optionally secondary) effect to players within a range that grows
// with power. Regeneration II is unlocked at power 4 with a primary
// already selected.

export type BeaconEffect =
  | 'speed'
  | 'haste'
  | 'resistance'
  | 'jump_boost'
  | 'strength'
  | 'regeneration';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface BeaconQuery {
  power: number; // 0..4
  primary: BeaconEffect | null;
  secondary: BeaconEffect | null;
  pos: Vec3;
}

// Range per power level (matches MC): 20, 30, 40, 50 blocks.
const RANGE_BY_POWER: readonly number[] = [0, 20, 30, 40, 50];

export function beaconRange(power: number): number {
  return RANGE_BY_POWER[Math.min(4, Math.max(0, power))] ?? 0;
}

// Which effects can be primary at each power level.
const PRIMARY_AT_POWER: Record<BeaconEffect, number> = {
  speed: 1,
  haste: 1,
  resistance: 2,
  jump_boost: 2,
  strength: 3,
  regeneration: 4, // can only be secondary at power 4
};

export function canSelectPrimary(effect: BeaconEffect, power: number): boolean {
  if (effect === 'regeneration') return false; // regeneration is secondary only
  return power >= PRIMARY_AT_POWER[effect];
}

export function canSelectSecondary(power: number, primary: BeaconEffect | null): boolean {
  if (power < 4) return false;
  return primary !== null;
}

// Given the beacon and a player's position, return the list of effects the
// player receives and their durations (continuously refreshed while in range).
export interface AppliedEffect {
  id: BeaconEffect;
  amplifier: number;
  durationSec: number;
}

export function effectsOn(query: BeaconQuery, playerPos: Vec3): AppliedEffect[] {
  if (query.power === 0) return [];
  const dx = playerPos.x - query.pos.x;
  const dy = playerPos.y - query.pos.y;
  const dz = playerPos.z - query.pos.z;
  const range = beaconRange(query.power);
  if (Math.hypot(dx, dy, dz) > range) return [];
  const out: AppliedEffect[] = [];
  if (query.primary) {
    out.push({ id: query.primary, amplifier: 0, durationSec: 13 });
  }
  if (query.secondary && query.power === 4) {
    out.push({ id: query.secondary, amplifier: 0, durationSec: 13 });
  }
  if (query.primary && query.secondary === query.primary && query.power === 4) {
    // Amplifier II bump when both slots are the same effect.
    const last = out[out.length - 1];
    if (last) last.amplifier = 1;
  }
  return out;
}

// Pyramid validation — counts the valid mineral blocks arranged as a
// pyramid directly beneath the beacon. MC wants iron/gold/diamond/emerald/
// netherite blocks; we accept any block name in `VALID_BEACON_BLOCKS`.

export const VALID_BEACON_BLOCKS = new Set<string>([
  'webmc:iron_block',
  'webmc:gold_block',
  'webmc:diamond_block',
  'webmc:emerald_block',
  'webmc:netherite_block',
]);

export interface PyramidLookup {
  blockName(x: number, y: number, z: number): string;
}

export function beaconPower(pos: Vec3, lookup: PyramidLookup): number {
  let power = 0;
  for (let layer = 1; layer <= 4; layer++) {
    const yy = pos.y - layer;
    let valid = true;
    for (let dx = -layer; dx <= layer && valid; dx++) {
      for (let dz = -layer; dz <= layer && valid; dz++) {
        if (!VALID_BEACON_BLOCKS.has(lookup.blockName(pos.x + dx, yy, pos.z + dz))) {
          valid = false;
        }
      }
    }
    if (valid) power = layer;
    else break;
  }
  return power;
}
