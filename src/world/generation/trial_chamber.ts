export interface Placement {
  chunkX: number;
  chunkZ: number;
  seed: number;
}

// Wiki (minecraft.wiki/w/Trial_Chambers): "Trial chambers generate
// underground in the Overworld. The starting room generates at an
// altitude of between Y=-40 and -20." So the start-room Y range is
// [-40, -20]. Old MAX_Y = -10 went 10 blocks above the wiki's
// upper bound, allowing trial-chamber start rooms to spawn into the
// regular stone band rather than the deepslate band.
//
// Wiki: "The generation of trial chambers follows a grid of 34×34
// chunk regions with 12-chunk minimum separation between adjacent
// trial chambers." Old SEPARATION = 10 was 2 chunks short of the
// wiki value, allowing trial chambers to spawn slightly closer
// together than canon.
export const SPAWN_SPACING = 34;
export const SEPARATION = 12;
export const MIN_Y = -40;
export const MAX_Y = -20;

function hash(x: number, z: number, seed: number): number {
  const h = Math.imul(x + seed, 2654435761) ^ Math.imul(z + seed, 1597334677);
  return (h >>> 0) / 0x100000000;
}

export function shouldPlaceStructure(p: Placement): boolean {
  const rx = ((p.chunkX % SPAWN_SPACING) + SPAWN_SPACING) % SPAWN_SPACING;
  const rz = ((p.chunkZ % SPAWN_SPACING) + SPAWN_SPACING) % SPAWN_SPACING;
  if (rx >= SPAWN_SPACING - SEPARATION) return false;
  if (rz >= SPAWN_SPACING - SEPARATION) return false;
  return hash(p.chunkX, p.chunkZ, p.seed) < 0.25;
}

export function pickY(seed: number, cx: number, cz: number): number {
  const f = hash(cx, cz, seed ^ 0xabcdef);
  return MIN_Y + Math.floor(f * (MAX_Y - MIN_Y + 1));
}
