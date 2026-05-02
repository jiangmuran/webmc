// Iron golem anger. Attacks hostile mobs on sight; attacks players
// with bad village reputation (< -100) after 5s.

export interface GolemAnger {
  angryAt: string | null;
  angryTicksRemaining: number;
}

export const REPUTATION_ANGER_THRESHOLD = -100;
export const ANGER_DURATION_TICKS = 600;
export const PLAYER_AGGRESSION_DELAY_TICKS = 100;

// Wiki (minecraft.wiki/w/Iron_Golem#Behavior): iron golems attack any
// nearby hostile mob (zombies/skeletons/spiders/illagers/witches/
// ravagers/zoglins/etc.) but explicitly AVOID creepers (the explosion
// would hurt nearby villagers). Bogged (1.21 skeleton variant) and
// zoglin (overworld-converted hoglin) were missing.
export function onHostileNearby(mobType: string): boolean {
  const hostiles = new Set([
    'zombie',
    'zombie_villager',
    'husk',
    'drowned',
    'skeleton',
    'stray',
    'wither_skeleton',
    'bogged',
    'spider',
    'cave_spider',
    'pillager',
    'vindicator',
    'evoker',
    'illusioner',
    'witch',
    'ravager',
    'zoglin',
  ]);
  return hostiles.has(mobType);
}

export function shouldAttackPlayer(reputation: number): boolean {
  return reputation <= REPUTATION_ANGER_THRESHOLD;
}

export function beginAnger(target: string): GolemAnger {
  return { angryAt: target, angryTicksRemaining: ANGER_DURATION_TICKS };
}

export function tick(a: GolemAnger): GolemAnger {
  if (a.angryTicksRemaining <= 1) return { angryAt: null, angryTicksRemaining: 0 };
  return { ...a, angryTicksRemaining: a.angryTicksRemaining - 1 };
}

export function offerPoppyDisarms(
  currentTarget: string | null,
  playerGivingPoppy: string,
): boolean {
  return currentTarget !== playerGivingPoppy;
}
