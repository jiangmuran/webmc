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
  | 'weaponsmith';

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
};

export function professionForBlock(block: string): Profession {
  for (const [prof, b] of Object.entries(WORKSTATIONS) as [Profession, string][]) {
    if (b === block && prof !== 'none') return prof;
  }
  return 'none';
}

export function workstationForProfession(p: Profession): string {
  return WORKSTATIONS[p];
}

export function canChangeProfession(current: Profession, hasTraded: boolean): boolean {
  if (current === 'none') return true;
  return !hasTraded;
}
