// Mob buoyancy on water. Most passive/ambient mobs float at the water
// surface (cow, pig, chicken, sheep, horse, etc.) by taking a small
// upward impulse each tick. Skeletons, zombies, and creepers sink
// instead — only drowned actively swim.

export type FloatBehavior = 'float' | 'sink' | 'swim' | 'aquatic_only';

const BEHAVIOR: Record<string, FloatBehavior> = {
  cow: 'float',
  pig: 'float',
  sheep: 'float',
  chicken: 'float',
  horse: 'float',
  donkey: 'float',
  mule: 'float',
  wolf: 'float',
  cat: 'float',
  ocelot: 'float',
  fox: 'float',
  bee: 'float',
  panda: 'float',
  polar_bear: 'float',
  llama: 'float',
  camel: 'float',
  allay: 'float',
  frog: 'float',
  armadillo: 'float',
  // Sink
  zombie: 'sink',
  skeleton: 'sink',
  creeper: 'sink',
  spider: 'sink',
  enderman: 'sink',
  witch: 'sink',
  husk: 'sink',
  stray: 'sink',
  zombified_piglin: 'sink',
  piglin: 'sink',
  piglin_brute: 'sink',
  iron_golem: 'sink',
  snow_golem: 'sink',
  bogged: 'sink',
  // Swim
  drowned: 'swim',
  guardian: 'swim',
  elder_guardian: 'swim',
  dolphin: 'swim',
  turtle: 'swim',
  axolotl: 'swim',
  // Aquatic-only (die on land)
  cod: 'aquatic_only',
  salmon: 'aquatic_only',
  pufferfish: 'aquatic_only',
  tropical_fish: 'aquatic_only',
  squid: 'aquatic_only',
  glow_squid: 'aquatic_only',
  tadpole: 'aquatic_only',
};

export function floatBehaviorOf(mob: string): FloatBehavior {
  return BEHAVIOR[mob] ?? 'sink';
}

// Per-tick vertical impulse while mostly submerged.
export function waterTickImpulseY(behavior: FloatBehavior): number {
  switch (behavior) {
    case 'float':
      return 0.05;
    case 'sink':
      return 0;
    case 'swim':
      return 0.03;
    case 'aquatic_only':
      return 0;
  }
}

// Which mobs take drown damage when head's under water for 15+s.
export function drowns(mob: string): boolean {
  const b = floatBehaviorOf(mob);
  return b === 'sink' || b === 'float';
}
