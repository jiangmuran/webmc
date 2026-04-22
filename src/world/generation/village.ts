// Village jigsaw pools. Villages are built from ~80 building templates
// per biome variant (plains/desert/savanna/taiga/snowy/jungle). Each
// village has a center piece (meeting place) and streets stretching in
// up to 4 directions with houses + workstations.

export type VillageBiome = 'plains' | 'desert' | 'savanna' | 'taiga' | 'snowy';

export type VillagePiece =
  | 'center'
  | 'street'
  | 'house_small'
  | 'house_medium'
  | 'house_large'
  | 'farm_crop'
  | 'farm_animal'
  | 'workstation_armorer'
  | 'workstation_butcher'
  | 'workstation_cartographer'
  | 'workstation_cleric'
  | 'workstation_farmer'
  | 'workstation_fisherman'
  | 'workstation_fletcher'
  | 'workstation_leatherworker'
  | 'workstation_librarian'
  | 'workstation_mason'
  | 'workstation_shepherd'
  | 'workstation_toolsmith'
  | 'workstation_weaponsmith'
  | 'lamp_post'
  | 'bell_tower'
  | 'well';

export interface VillagePieceDef {
  kind: VillagePiece;
  weight: number;
}

export const VILLAGE_POOLS: Record<VillageBiome, readonly VillagePieceDef[]> = {
  plains: [
    { kind: 'center', weight: 1 },
    { kind: 'street', weight: 20 },
    { kind: 'house_small', weight: 8 },
    { kind: 'house_medium', weight: 5 },
    { kind: 'house_large', weight: 2 },
    { kind: 'farm_crop', weight: 4 },
    { kind: 'farm_animal', weight: 2 },
    { kind: 'workstation_farmer', weight: 2 },
    { kind: 'workstation_butcher', weight: 1 },
    { kind: 'workstation_librarian', weight: 1 },
    { kind: 'workstation_toolsmith', weight: 1 },
    { kind: 'lamp_post', weight: 3 },
    { kind: 'bell_tower', weight: 1 },
    { kind: 'well', weight: 1 },
  ],
  desert: [
    { kind: 'center', weight: 1 },
    { kind: 'street', weight: 20 },
    { kind: 'house_small', weight: 6 },
    { kind: 'house_medium', weight: 4 },
    { kind: 'house_large', weight: 2 },
    { kind: 'workstation_mason', weight: 1 },
    { kind: 'workstation_cartographer', weight: 1 },
    { kind: 'workstation_leatherworker', weight: 1 },
    { kind: 'well', weight: 2 },
  ],
  savanna: [
    { kind: 'center', weight: 1 },
    { kind: 'street', weight: 20 },
    { kind: 'house_small', weight: 7 },
    { kind: 'house_medium', weight: 4 },
    { kind: 'workstation_fletcher', weight: 1 },
    { kind: 'workstation_shepherd', weight: 2 },
  ],
  taiga: [
    { kind: 'center', weight: 1 },
    { kind: 'street', weight: 20 },
    { kind: 'house_small', weight: 6 },
    { kind: 'house_medium', weight: 3 },
    { kind: 'workstation_weaponsmith', weight: 1 },
    { kind: 'workstation_fisherman', weight: 1 },
  ],
  snowy: [
    { kind: 'center', weight: 1 },
    { kind: 'street', weight: 20 },
    { kind: 'house_small', weight: 6 },
    { kind: 'workstation_armorer', weight: 1 },
    { kind: 'workstation_cleric', weight: 1 },
  ],
};

export interface PlacedVillagePiece {
  kind: VillagePiece;
  at: { x: number; z: number };
}

export interface VillageQuery {
  biome: VillageBiome;
  origin: { x: number; z: number };
  rng: () => number;
  radius: number; // approx grid radius
}

export function planVillage(q: VillageQuery): PlacedVillagePiece[] {
  const pool = VILLAGE_POOLS[q.biome];
  const out: PlacedVillagePiece[] = [{ kind: 'center', at: { ...q.origin } }];
  for (let r = 1; r <= q.radius; r++) {
    const perRing = 4 * r;
    for (let i = 0; i < perRing; i++) {
      const picked = pickPiece(pool, q.rng());
      if (!picked) continue;
      const angle = (i / perRing) * Math.PI * 2;
      const x = q.origin.x + Math.round(Math.cos(angle) * r * 6);
      const z = q.origin.z + Math.round(Math.sin(angle) * r * 6);
      out.push({ kind: picked.kind, at: { x, z } });
    }
  }
  return out;
}

function pickPiece(pool: readonly VillagePieceDef[], roll: number): VillagePieceDef | null {
  // Remove the center piece from random picks (it's placed explicitly).
  const pickable = pool.filter((p) => p.kind !== 'center');
  const total = pickable.reduce((s, p) => s + p.weight, 0);
  if (total <= 0) return null;
  const target = roll * total;
  let acc = 0;
  for (const p of pickable) {
    acc += p.weight;
    if (target < acc) return p;
  }
  return pickable[pickable.length - 1] ?? null;
}

export function countPieces(placements: readonly PlacedVillagePiece[], kind: VillagePiece): number {
  let n = 0;
  for (const p of placements) if (p.kind === kind) n++;
  return n;
}
