// Conduit — an underwater beacon. Built from a frame of prismarine blocks
// (up to 42 blocks in a 5×5×5 cube with the conduit at the center); the
// strength of the Conduit Power effect scales with the frame size.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface ConduitLookup {
  isActivatorBlock(x: number, y: number, z: number): boolean;
  isWater(x: number, y: number, z: number): boolean;
}

// Count prismarine blocks in the 5×5×5 activation frame around the conduit.
// MC rule: only the "inner faces" of the surrounding 5×5×5 shell count —
// specifically the ring one block out from center on each axis.
export function conduitPower(pos: Vec3, lookup: ConduitLookup): number {
  // Must be surrounded by water in the 3×3×3 immediately adjacent cells.
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dz = -1; dz <= 1; dz++) {
        if (dx === 0 && dy === 0 && dz === 0) continue;
        if (!lookup.isWater(pos.x + dx, pos.y + dy, pos.z + dz)) return 0;
      }
    }
  }
  let power = 0;
  for (let dx = -2; dx <= 2; dx++) {
    for (let dy = -2; dy <= 2; dy++) {
      for (let dz = -2; dz <= 2; dz++) {
        if (Math.abs(dx) + Math.abs(dy) + Math.abs(dz) === 0) continue;
        const onFrame = Math.abs(dx) === 2 || Math.abs(dy) === 2 || Math.abs(dz) === 2;
        if (!onFrame) continue;
        if (lookup.isActivatorBlock(pos.x + dx, pos.y + dy, pos.z + dz)) power++;
      }
    }
  }
  return power;
}

// Range in blocks of the Conduit Power effect. Scales with power:
// 16..96 (+16 per 7 frame blocks, capped at 96).
export function conduitRange(power: number): number {
  if (power < 16) return 0; // minimum frame: 16 blocks.
  const tier = Math.floor((power - 16) / 7);
  return Math.min(96, 16 + tier * 16);
}

export interface ConduitEffect {
  id: string;
  amplifier: number;
  durationSec: number;
}

export function effectsInRange(power: number): ConduitEffect[] {
  if (power < 16) return [];
  return [
    { id: 'conduit_power', amplifier: 0, durationSec: 13 },
    { id: 'water_breathing', amplifier: 0, durationSec: 13 },
    { id: 'night_vision', amplifier: 0, durationSec: 13 },
  ];
}
