// Skeleton horse trap. During thunderstorm, a rare "trap" skeleton horse
// spawns; when approached, lightning strikes + 4 skeleton riders appear.
//
// Wiki (minecraft.wiki/w/Skeleton_Horse#Trap): "In Java Edition,
// every lightning strike during a thunderstorm has a 0.75% to 1.5%
// chance to spawn a skeleton trap horse instead of striking,
// depending on regional difficulty."
//
// 0.75% × regionalDifficulty (0..2) → 0%..1.5%. Old code disallowed
// Easy difficulty entirely; that's a Bedrock-only rule. Java allows
// trap horses on Easy too (with proportionally lower chance from
// the lower regional difficulty).

export interface StormCtx {
  thundering: boolean;
  difficulty: 'easy' | 'normal' | 'hard';
  regionalDifficulty: number;
  rand: () => number;
}

export const TRAP_HORSE_RARE_CHANCE = 0.0075;

export function shouldSpawnTrap(c: StormCtx): boolean {
  if (!c.thundering) return false;
  return c.rand() < TRAP_HORSE_RARE_CHANCE * c.regionalDifficulty;
}

export const TRAP_RIDER_COUNT = 4;

export function onPlayerApproach(): { lightning: boolean; riders: number } {
  return { lightning: true, riders: TRAP_RIDER_COUNT };
}
