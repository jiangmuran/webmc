// Wiki (minecraft.wiki/w/Villager#Professions): 13 working professions
// + unemployed + nitwit. Nitwits are a separate profession that doesn't
// trade and can never claim a workstation; sibling
// villager_profession.ts already includes them. Old union here omitted
// 'nitwit', so a villager_profession.ts caller passing a nitwit got a
// type error and the workstation lookup defaulted to 'none'.
export type Profession =
  | 'none'
  | 'armorer'
  | 'butcher'
  | 'cartographer'
  | 'cleric'
  | 'farmer'
  | 'fisherman'
  | 'fletcher'
  | 'leatherworker'
  | 'librarian'
  | 'mason'
  | 'shepherd'
  | 'toolsmith'
  | 'weaponsmith'
  | 'nitwit';

const WORKSTATIONS: Record<Profession, string> = {
  none: '',
  armorer: 'blast_furnace',
  butcher: 'smoker',
  cartographer: 'cartography_table',
  cleric: 'brewing_stand',
  farmer: 'composter',
  fisherman: 'barrel',
  fletcher: 'fletching_table',
  leatherworker: 'cauldron',
  librarian: 'lectern',
  mason: 'stonecutter',
  shepherd: 'loom',
  toolsmith: 'smithing_table',
  weaponsmith: 'grindstone',
  // Wiki: nitwits never claim a workstation.
  nitwit: '',
};

export function professionForBlock(block: string): Profession {
  for (const [prof, b] of Object.entries(WORKSTATIONS) as [Profession, string][]) {
    if (b === block && prof !== 'none' && prof !== 'nitwit') return prof;
  }
  return 'none';
}

export function workstationForProfession(p: Profession): string {
  return WORKSTATIONS[p];
}

export function canChangeProfession(current: Profession, hasTraded: boolean): boolean {
  if (current === 'none') return true;
  // Wiki: nitwits never change profession (locked at spawn).
  if (current === 'nitwit') return false;
  return !hasTraded;
}
