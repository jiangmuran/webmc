// Villager profession assignment. An unemployed villager claims a
// nearby unclaimed job-site block. One block = one profession. If the
// site is destroyed or becomes out of pathfinding range, the villager
// unemploys. Nitwits never take a profession.

export type Profession =
  | 'nitwit'
  | 'unemployed'
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

const SITE_TO_PROF: Record<string, Profession> = {
  'webmc:blast_furnace': 'armorer',
  'webmc:smoker': 'butcher',
  'webmc:cartography_table': 'cartographer',
  'webmc:brewing_stand': 'cleric',
  'webmc:composter': 'farmer',
  'webmc:barrel': 'fisherman',
  'webmc:fletching_table': 'fletcher',
  'webmc:cauldron': 'leatherworker',
  'webmc:lectern': 'librarian',
  'webmc:stonecutter': 'mason',
  'webmc:loom': 'shepherd',
  'webmc:smithing_table': 'toolsmith',
  'webmc:grindstone': 'weaponsmith',
};

export function professionForSite(blockId: string): Profession | null {
  return SITE_TO_PROF[blockId] ?? null;
}

export interface Villager {
  profession: Profession;
  claimedSite: { x: number; y: number; z: number } | null;
}

export function makeVillager(isNitwit = false): Villager {
  return {
    profession: isNitwit ? 'nitwit' : 'unemployed',
    claimedSite: null,
  };
}

export interface ClaimQuery {
  siteBlockId: string;
  sitePos: { x: number; y: number; z: number };
  siteAlreadyClaimed: boolean;
}

export function tryClaim(v: Villager, q: ClaimQuery): boolean {
  if (v.profession === 'nitwit') return false;
  if (v.profession !== 'unemployed') return false;
  if (q.siteAlreadyClaimed) return false;
  const prof = professionForSite(q.siteBlockId);
  if (!prof) return false;
  v.profession = prof;
  v.claimedSite = q.sitePos;
  return true;
}

export function unemploy(v: Villager): void {
  if (v.profession === 'nitwit') return;
  v.profession = 'unemployed';
  v.claimedSite = null;
}
