export type VillagerLevel = 'novice' | 'apprentice' | 'journeyman' | 'expert' | 'master';

const LEVEL_XP: Record<VillagerLevel, number> = {
  novice: 0,
  apprentice: 10,
  journeyman: 70,
  expert: 150,
  master: 250,
};

export function levelFromXp(xp: number): VillagerLevel {
  if (xp >= LEVEL_XP.master) return 'master';
  if (xp >= LEVEL_XP.expert) return 'expert';
  if (xp >= LEVEL_XP.journeyman) return 'journeyman';
  if (xp >= LEVEL_XP.apprentice) return 'apprentice';
  return 'novice';
}

// Wiki: villager trade badges progress stone → iron → gold → emerald
// → diamond. Code had apprentice/journeyman swapped (gold/iron) and
// expert/master as diamond/netherite — neither emerald nor netherite
// is correct (vanilla expert is emerald, master is diamond).
export function badgeMaterial(level: VillagerLevel): string {
  if (level === 'master') return 'diamond';
  if (level === 'expert') return 'emerald';
  if (level === 'journeyman') return 'gold';
  if (level === 'apprentice') return 'iron';
  return 'stone';
}

export function tradesUnlockedForLevel(level: VillagerLevel): number {
  if (level === 'master') return 10;
  if (level === 'expert') return 8;
  if (level === 'journeyman') return 6;
  if (level === 'apprentice') return 4;
  return 2;
}
