// Bamboo growth. Grows vertically up to 12-16 blocks; a small random
// chance per random tick. The top segment has a "stage" (0 small, 1
// medium, 2 large leaves); the bottom segments are plain shoots.

export type BambooLeafStage = 'small' | 'medium' | 'large' | 'none';

export interface BambooSegment {
  isTop: boolean;
  leafStage: BambooLeafStage;
  heightFromGround: number;
}

export function makeBamboo(heightFromGround: number, isTop: boolean): BambooSegment {
  return {
    isTop,
    leafStage: isTop ? 'large' : 'none',
    heightFromGround,
  };
}

export interface BambooGrowCtx {
  age: number; // segments stacked from ground
  roll: number;
  skyLightAtTop: number;
  maxHeight: number;
}

const GROW_CHANCE = 1 / 60;
const MIN_LIGHT = 9;

export type BambooTickResult = 'grew' | 'none';

export function tryGrowBamboo(ctx: BambooGrowCtx): BambooTickResult {
  if (ctx.age >= ctx.maxHeight) return 'none';
  if (ctx.skyLightAtTop < MIN_LIGHT) return 'none';
  return ctx.roll < GROW_CHANCE ? 'grew' : 'none';
}

// Natural bamboo jungle growth: bamboo has a 40% chance per "bamboo
// event" to spawn a tall (12..16) patch, 60% short (5..7).
export interface BambooSpawnQuery {
  rng: () => number;
}

export interface BambooSpawnHeight {
  height: number;
}

export function rollBambooHeight(q: BambooSpawnQuery): BambooSpawnHeight {
  const tall = q.rng() < 0.4;
  const base = tall ? 12 : 5;
  const span = tall ? 5 : 3;
  return { height: base + Math.floor(q.rng() * span) };
}

// Bone meal adds 1-2 segments, even if light is too dim.
export function boneMealBamboo(ctx: { currentHeight: number; rng: () => number }): number {
  const add = 1 + Math.floor(ctx.rng() * 2);
  return Math.min(ctx.currentHeight + add, 16);
}

// Breaking drops 1 bamboo per segment. With sword, chops instantly.
export function breakBamboo(
  segmentCount: number,
  toolIsSword: boolean,
): {
  drops: { item: 'webmc:bamboo'; count: number }[];
  instantBreak: boolean;
} {
  return {
    drops: [{ item: 'webmc:bamboo', count: segmentCount }],
    instantBreak: toolIsSword,
  };
}
