export const SUSPICIOUS_GRAVEL_CHANCE = 0.3;

export const DECOR_BLOCKS = [
  'gravel',
  'packed_mud',
  'mud_bricks',
  'mud_brick_slab',
  'mud_brick_stairs',
  'mud_brick_wall',
];

export function isEligibleFloorBlock(b: string): boolean {
  return DECOR_BLOCKS.includes(b);
}

export function shouldEmbedSuspicious(rng: () => number): boolean {
  return rng() < SUSPICIOUS_GRAVEL_CHANCE;
}
