// Coral reef generation. Warm oceans produce reefs with 5 coral colors
// (tube/brain/bubble/fire/horn) + coral fans + sea pickles + tropical
// fish. Coral outside water dies into dead_* within 60 ticks.

export type CoralColor = 'tube' | 'brain' | 'bubble' | 'fire' | 'horn';

export type CoralForm = 'block' | 'fan' | 'wall_fan' | 'shoot';

export const CORAL_COLORS: readonly CoralColor[] = ['tube', 'brain', 'bubble', 'fire', 'horn'];

export interface CoralBlock {
  color: CoralColor;
  form: CoralForm;
  alive: boolean;
  secondsOutOfWater: number;
}

const DIE_SECONDS = 3; // 60 ticks

export function makeCoral(color: CoralColor, form: CoralForm = 'block'): CoralBlock {
  return { color, form, alive: true, secondsOutOfWater: 0 };
}

// Called each tick. Dead coral stays as "dead_<color>_<form>".
export function tickCoral(state: CoralBlock, inWater: boolean, dtSec: number): boolean {
  if (!state.alive) return false;
  if (inWater) {
    state.secondsOutOfWater = 0;
    return false;
  }
  state.secondsOutOfWater += dtSec;
  if (state.secondsOutOfWater >= DIE_SECONDS) {
    state.alive = false;
    return true;
  }
  return false;
}

export function blockId(state: CoralBlock): string {
  const prefix = state.alive ? '' : 'dead_';
  return `webmc:${prefix}${state.color}_${state.form === 'block' ? 'coral_block' : 'coral_' + state.form}`;
}

// Reef layout: radial cluster around origin, density drops with distance.
export interface ReefLayout {
  blocks: readonly { pos: { x: number; y: number; z: number }; color: CoralColor }[];
  fanCount: number;
  seaPickleCount: number;
}

export interface ReefQuery {
  origin: { x: number; y: number; z: number };
  radius: number;
  rng: () => number;
}

export function planReef(q: ReefQuery): ReefLayout {
  const blocks: { pos: { x: number; y: number; z: number }; color: CoralColor }[] = [];
  for (let dx = -q.radius; dx <= q.radius; dx++) {
    for (let dz = -q.radius; dz <= q.radius; dz++) {
      const d = Math.hypot(dx, dz);
      if (d > q.radius) continue;
      const density = 1 - d / q.radius;
      if (q.rng() > density) continue;
      const color = CORAL_COLORS[Math.floor(q.rng() * CORAL_COLORS.length)];
      if (!color) continue;
      blocks.push({
        pos: { x: q.origin.x + dx, y: q.origin.y, z: q.origin.z + dz },
        color,
      });
    }
  }
  return {
    blocks,
    fanCount: Math.floor(blocks.length * 0.3),
    seaPickleCount: Math.floor(blocks.length * 0.1),
  };
}
