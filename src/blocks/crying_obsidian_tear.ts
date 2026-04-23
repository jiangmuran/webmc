export const EMIT_PARTICLE = 'dripping_obsidian_tear';
export const AVG_EMIT_CHANCE_PER_TICK = 0.055;

export function isRespawnAnchorComponent(): boolean {
  return true;
}

export function emitsParticleThisTick(rng: () => number): boolean {
  return rng() < AVG_EMIT_CHANCE_PER_TICK;
}

export function blastResistance(): number {
  return 1200;
}
