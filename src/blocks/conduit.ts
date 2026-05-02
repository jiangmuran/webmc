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

// Wiki (minecraft.wiki/w/Conduit): "The effective radius of the
// conduit is 16 blocks for every seven blocks in the frame, though
// the effect does not activate until the minimum of 16 blocks is
// included in the build. Thus, it extends to 48 at 21 blocks, 64 at
// 28 blocks, 80 at 35 blocks, and 96 with a complete frame of 42
// blocks."
//
// Old `tier = floor((power-16)/7); range = 16 + tier*16` produced
// 16/16/16/32/32/.../48 — wrong by ~50% across the entire active
// range (e.g. 42-block full frame yielded 64 blocks instead of the
// canonical 96). New formula matches wiki: range = floor(blocks/7) * 16.
export function conduitRange(power: number): number {
  if (power < 16) return 0;
  return Math.min(96, Math.floor(power / 7) * 16);
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
