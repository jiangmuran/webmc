// Magma cube. Nether-native slime variant: sizes 1/2/4 (small/medium/
// large). On death, drops magma cream (medium+); medium and large split
// into 2-4 smaller cubes.

export type MagmaCubeSize = 1 | 2 | 4;

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface MagmaCubeState {
  id: number;
  size: MagmaCubeSize;
  position: Vec3;
  health: number;
}

export function maxHealthForSize(size: MagmaCubeSize): number {
  return size === 1 ? 1 : size === 2 ? 4 : 16;
}

export function makeMagmaCube(id: number, size: MagmaCubeSize, at: Vec3): MagmaCubeState {
  return { id, size, position: { ...at }, health: maxHealthForSize(size) };
}

export interface MagmaSplitResult {
  children: readonly MagmaCubeSize[];
  droppedMagmaCream: number;
}

export function onDeath(size: MagmaCubeSize, rng: () => number): MagmaSplitResult {
  const children: MagmaCubeSize[] = [];
  let cream = 0;
  if (size === 4) {
    const n = 2 + Math.floor(rng() * 3);
    for (let i = 0; i < n; i++) children.push(2);
    if (rng() < 0.25) cream = 1;
  } else if (size === 2) {
    const n = 2 + Math.floor(rng() * 3);
    for (let i = 0; i < n; i++) children.push(1);
    if (rng() < 0.25) cream = 1;
  }
  return { children, droppedMagmaCream: cream };
}

// Wiki (minecraft.wiki/w/Magma_Cube): "The attack strength is its
// size + 2." Plus per-difficulty multipliers; Normal-difficulty
// values are 3 / 4 / 6 for sizes 1 / 2 / 4.
//
// Old small-cube damage was 2 (off-by-one from the wiki's "size+2"
// rule). The "tiny magma cubes can deal damage to the player" wiki
// note made the bug visible — players hit by a small magma cube
// took 2 HP instead of the canonical 3.
export function attackDamageBySize(size: MagmaCubeSize): number {
  return size + 2;
}

// Magma cubes are fire-immune AND take no fall damage.
export function fireImmune(): true {
  return true;
}

export function fallDamage(): 0 {
  return 0;
}
