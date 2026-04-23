export const CHUNK_SIZE = 16;

export interface HeightmapInput {
  getBlockY: (x: number, z: number, maxY: number) => string;
  topY: number;
  bottomY: number;
}

export type HeightMap = number[];

export function buildTopSolid(input: HeightmapInput): HeightMap {
  const map: number[] = new Array<number>(CHUNK_SIZE * CHUNK_SIZE).fill(input.bottomY - 1);
  for (let x = 0; x < CHUNK_SIZE; x++) {
    for (let z = 0; z < CHUNK_SIZE; z++) {
      for (let y = input.topY; y >= input.bottomY; y--) {
        const block = input.getBlockY(x, z, y);
        if (block !== 'air') {
          map[x * CHUNK_SIZE + z] = y;
          break;
        }
      }
    }
  }
  return map;
}

export function heightAt(map: HeightMap, x: number, z: number): number {
  return map[x * CHUNK_SIZE + z] ?? -1;
}
