// Animated texture frame cycle. MC textures like water, lava, prismarine
// iterate through a vertical strip of N frames. Each frame has a display
// duration; the current frame is picked by the renderer per chunk-mesh.

export interface AnimatedTextureDef {
  readonly name: string;
  readonly frameCount: number;
  readonly frameDurationTicks: number;
  readonly interpolate: boolean; // true = blend between frames
}

export const ANIMATED: Record<string, AnimatedTextureDef> = {
  water_still: { name: 'water_still', frameCount: 32, frameDurationTicks: 2, interpolate: true },
  water_flow: { name: 'water_flow', frameCount: 32, frameDurationTicks: 1, interpolate: true },
  lava_still: { name: 'lava_still', frameCount: 20, frameDurationTicks: 2, interpolate: true },
  lava_flow: { name: 'lava_flow', frameCount: 16, frameDurationTicks: 1, interpolate: true },
  magma: { name: 'magma', frameCount: 8, frameDurationTicks: 3, interpolate: false },
  prismarine: { name: 'prismarine', frameCount: 22, frameDurationTicks: 8, interpolate: false },
  sea_lantern: { name: 'sea_lantern', frameCount: 5, frameDurationTicks: 3, interpolate: false },
  portal: { name: 'portal', frameCount: 32, frameDurationTicks: 1, interpolate: true },
  end_portal: { name: 'end_portal', frameCount: 1, frameDurationTicks: 1, interpolate: false },
  fire_0: { name: 'fire_0', frameCount: 32, frameDurationTicks: 1, interpolate: false },
  soul_fire_0: { name: 'soul_fire_0', frameCount: 32, frameDurationTicks: 1, interpolate: false },
};

export function frameAtTick(def: AnimatedTextureDef, ticks: number): number {
  const totalTicks = def.frameCount * def.frameDurationTicks;
  const normalized = ((ticks % totalTicks) + totalTicks) % totalTicks;
  return Math.floor(normalized / def.frameDurationTicks);
}

// Blend amount between this frame and the next [0, 1).
export function interpolationBlend(def: AnimatedTextureDef, ticks: number): number {
  if (!def.interpolate) return 0;
  const totalTicks = def.frameCount * def.frameDurationTicks;
  const normalized = ((ticks % totalTicks) + totalTicks) % totalTicks;
  return (normalized % def.frameDurationTicks) / def.frameDurationTicks;
}

// Pick the next frame index (wraps around).
export function nextFrame(def: AnimatedTextureDef, currentFrame: number): number {
  return (currentFrame + 1) % def.frameCount;
}
