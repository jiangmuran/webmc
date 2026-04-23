// Debug HUD (F3) info snapshot.

export interface DebugInfo {
  pos: { x: number; y: number; z: number };
  facing: string;
  biome: string;
  lightBlock: number;
  lightSky: number;
  fps: number;
  chunkX: number;
  chunkZ: number;
  loadedChunks: number;
}

export function facingFrom(yaw: number): string {
  const r = ((yaw % 360) + 360) % 360;
  if (r < 45 || r >= 315) return 'south';
  if (r < 135) return 'west';
  if (r < 225) return 'north';
  return 'east';
}

export function formatPos(p: { x: number; y: number; z: number }): string {
  return `${p.x.toFixed(3)} / ${p.y.toFixed(5)} / ${p.z.toFixed(3)}`;
}

export function chunkCoords(x: number, z: number): { cx: number; cz: number } {
  return { cx: Math.floor(x / 16), cz: Math.floor(z / 16) };
}

export function summary(i: DebugInfo): string {
  return `${i.fps} FPS  ${formatPos(i.pos)}  ${i.facing}  ${i.biome}`;
}
