// End portal teleport. Stepping inside the portal block instantly
// teleports to the End dimension's obsidian platform.

export const END_PLATFORM_CENTER = { x: 100, y: 48, z: 0 };

export interface TeleportCtx {
  entityDimension: string;
}

export function targetFor(c: TeleportCtx): { dimension: string; x: number; y: number; z: number } {
  if (c.entityDimension === 'the_end') {
    return { dimension: 'overworld', ...WORLD_SPAWN };
  }
  return { dimension: 'the_end', ...END_PLATFORM_CENTER };
}

const WORLD_SPAWN = { x: 0, y: 64, z: 0 };

export function refreshesEndPlatform(goingToEnd: boolean): boolean {
  return goingToEnd;
}

// End portal destroys nearby blocks on platform-refresh (a 5x5x3 box).
export const PLATFORM_CLEAR_VOLUME = { w: 5, h: 3, d: 5 };
