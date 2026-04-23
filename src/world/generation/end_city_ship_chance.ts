export const SHIP_CHANCE = 0.5;

export function hasShip(rng: () => number): boolean {
  return rng() < SHIP_CHANCE;
}

export function elytraInShip(rng: () => number): boolean {
  return rng() < 1; // always if ship spawns
}

export function shulkersInCity(): number {
  return 3;
}
