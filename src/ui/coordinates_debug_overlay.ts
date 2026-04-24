export interface DebugInfo {
  x: number;
  y: number;
  z: number;
  chunkX: number;
  chunkZ: number;
  facing: 'north' | 'south' | 'east' | 'west';
  biome: string;
  lightLevel: number;
  fps: number;
  memoryMB: number;
}

export function formatDebug(d: DebugInfo): readonly string[] {
  return [
    `XYZ: ${d.x.toFixed(2)} / ${d.y.toFixed(2)} / ${d.z.toFixed(2)}`,
    `Block: ${Math.floor(d.x)} ${Math.floor(d.y)} ${Math.floor(d.z)}`,
    `Chunk: ${d.chunkX} ${d.chunkZ}`,
    `Facing: ${d.facing}`,
    `Biome: ${d.biome}`,
    `Sky Light: ${d.lightLevel}`,
    `FPS: ${d.fps.toFixed(0)}`,
    `Mem: ${d.memoryMB.toFixed(0)} MB`,
  ];
}

export function yawToFacing(yaw: number): DebugInfo['facing'] {
  const normalized = ((yaw % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  const octant = Math.floor(((normalized + Math.PI / 4) / (Math.PI / 2)) % 4);
  return (['south', 'west', 'north', 'east'] as const)[octant] ?? 'north';
}
