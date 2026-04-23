export interface DebugCtx {
  fps: number;
  chunk: { x: number; z: number };
  biome: string;
  blockPos: { x: number; y: number; z: number };
  direction: string;
  lightLevel: number;
}

export function linesFor(c: DebugCtx): string[] {
  return [
    `FPS: ${c.fps}`,
    `Chunk: ${c.chunk.x}, ${c.chunk.z}`,
    `Biome: ${c.biome}`,
    `XYZ: ${c.blockPos.x} ${c.blockPos.y} ${c.blockPos.z}`,
    `Facing: ${c.direction}`,
    `Light: ${c.lightLevel}`,
  ];
}

export function hasGraph(): boolean {
  return true;
}
