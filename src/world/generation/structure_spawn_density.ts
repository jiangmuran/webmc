export type StructureType =
  | 'village'
  | 'stronghold'
  | 'mineshaft'
  | 'ocean_monument'
  | 'woodland_mansion'
  | 'desert_temple'
  | 'jungle_temple'
  | 'igloo'
  | 'shipwreck'
  | 'buried_treasure'
  | 'ocean_ruin'
  | 'nether_fortress'
  | 'bastion'
  | 'end_city'
  | 'pillager_outpost'
  | 'ruined_portal'
  | 'ancient_city'
  | 'trial_chamber'
  | 'trail_ruins';

export const SPACING: Record<StructureType, number> = {
  village: 34,
  stronghold: 64,
  mineshaft: 1,
  ocean_monument: 32,
  woodland_mansion: 80,
  desert_temple: 32,
  jungle_temple: 32,
  igloo: 32,
  shipwreck: 24,
  buried_treasure: 1,
  ocean_ruin: 20,
  nether_fortress: 27,
  bastion: 27,
  end_city: 20,
  pillager_outpost: 32,
  ruined_portal: 40,
  ancient_city: 24,
  trial_chamber: 34,
  trail_ruins: 34,
};

export function regionSize(t: StructureType): number {
  return SPACING[t];
}
