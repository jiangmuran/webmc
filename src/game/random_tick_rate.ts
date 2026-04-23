export const DEFAULT_RANDOM_TICK_SPEED = 3;
export const BLOCKS_PER_SUBCHUNK = 4096;

export function randomTicksPerSubchunkPerTick(rate: number): number {
  return Math.max(0, Math.floor(rate));
}

export function blocksTickedPerChunkPerTick(rate: number, subchunkCount: number): number {
  return randomTicksPerSubchunkPerTick(rate) * subchunkCount;
}

export function totalTicksPerSecond(rate: number, loadedSubchunks: number): number {
  return blocksTickedPerChunkPerTick(rate, loadedSubchunks) * 20;
}
