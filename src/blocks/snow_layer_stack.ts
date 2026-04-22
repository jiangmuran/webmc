// Snow layer. Stacks 1..8 layers (8 = full block). Shovels drop 1
// snowball per layer. Melts under light >= 11 (with full "melt chance"
// 1/16 per random tick).

export type SnowHeight = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface SnowLayerState {
  height: SnowHeight;
}

export function makeSnowLayer(h: SnowHeight = 1): SnowLayerState {
  return { height: h };
}

export function addSnowflake(state: SnowLayerState): boolean {
  if (state.height >= 8) return false;
  state.height = (state.height + 1) as SnowHeight;
  return true;
}

// Break drops: by shovel, drops one snowball per layer; by hand, drops
// nothing in survival.
export function snowBreakDrops(
  state: SnowLayerState,
  tool: 'shovel' | 'hand' | 'other',
): { item: 'webmc:snowball'; count: number }[] {
  if (tool !== 'shovel') return [];
  return [{ item: 'webmc:snowball', count: state.height }];
}

// Melt tick: returns true if fully melted (no layers left).
export interface MeltCtx {
  blockLightLevel: number;
  skyLightLevel: number;
  randomRoll: number;
}

const MELT_CHANCE = 1 / 16;
const MELT_LIGHT_THRESHOLD = 11;

export function tickMelt(state: SnowLayerState, ctx: MeltCtx): boolean {
  const maxLight = Math.max(ctx.blockLightLevel, ctx.skyLightLevel);
  if (maxLight < MELT_LIGHT_THRESHOLD) return false;
  if (ctx.randomRoll >= MELT_CHANCE) return false;
  if (state.height === 1) {
    state.height = 1;
    return true;
  }
  state.height = (state.height - 1) as SnowHeight;
  return false;
}

// Snow falling accumulation: when it snows in a cold biome, each chunk
// tick adds a layer to surfaces exposed to sky, up to a max height.
export function maxSnowAccumulation(gameruleHeight: number): SnowHeight {
  const clamped = Math.max(1, Math.min(8, Math.floor(gameruleHeight))) as SnowHeight;
  return clamped;
}
