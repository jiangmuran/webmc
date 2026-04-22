// F3 debug overlay state. Toggles a text HUD with fps, coords, facing,
// chunk info, biome, light level. Sub-toggles: F3+G shows chunk
// borders, F3+B shows hitboxes, F3+N cycles spectator/creative.

export interface DebugOverlay {
  open: boolean;
  showChunkBorders: boolean;
  showHitboxes: boolean;
}

export function makeDebugOverlay(): DebugOverlay {
  return { open: false, showChunkBorders: false, showHitboxes: false };
}

export type DebugKey = 'F3' | 'F3+G' | 'F3+B' | 'F3+A' | 'esc';

export function handleKey(s: DebugOverlay, k: DebugKey): void {
  if (k === 'F3') s.open = !s.open;
  else if (k === 'F3+G') s.showChunkBorders = !s.showChunkBorders;
  else if (k === 'F3+B') s.showHitboxes = !s.showHitboxes;
  else if (k === 'F3+A') {
    // reload chunks — no persistent state change beyond signal
  } else s.open = false;
}

export interface DebugStats {
  fps: number;
  x: number;
  y: number;
  z: number;
  facing: 'N' | 'S' | 'E' | 'W';
  biome: string;
  chunkLoaded: number;
}

export function formatLine1(s: DebugStats): string {
  return `webmc fps=${s.fps} xyz=${s.x.toFixed(2)}/${s.y.toFixed(2)}/${s.z.toFixed(2)} facing=${s.facing}`;
}

export function formatLine2(s: DebugStats): string {
  return `biome=${s.biome} chunks=${s.chunkLoaded}`;
}
