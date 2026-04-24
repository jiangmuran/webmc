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

export function badgeMaterial(level: VillagerLevel): string {
  if (level === 'master') return 'netherite';
  if (level === 'expert') return 'diamond';
  if (level === 'journeyman') return 'iron';
  if (level === 'apprentice') return 'gold';
  return 'stone';
}

export function tradesUnlockedForLevel(level: VillagerLevel): number {
  if (level === 'master') return 10;
  if (level === 'expert') return 8;
  if (level === 'journeyman') return 6;
  if (level === 'apprentice') return 4;
  return 2;
}
