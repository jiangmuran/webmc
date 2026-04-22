// Pressure plate variants. Wood/stone/light/heavy weighted; activation
// threshold + signal strength differ.

export type PressurePlateKind =
  | 'wood'
  | 'stone'
  | 'polished_blackstone'
  | 'light_weighted' // gold, counts items 1..15
  | 'heavy_weighted'; // iron, counts items capped by ÷ 10

export interface PressurePlateDef {
  kind: PressurePlateKind;
  // Number of entities needed to emit non-zero signal.
  minEntities: number;
  // Whether items (item entities) trigger this plate.
  triggersOnItems: boolean;
  // Whether hostile mobs can trigger it.
  triggersOnMobs: boolean;
  // Whether only players trigger it.
  playerOnly: boolean;
}

export const PLATE_DEFS: Record<PressurePlateKind, PressurePlateDef> = {
  wood: {
    kind: 'wood',
    minEntities: 1,
    triggersOnItems: true,
    triggersOnMobs: true,
    playerOnly: false,
  },
  stone: {
    kind: 'stone',
    minEntities: 1,
    triggersOnItems: false,
    triggersOnMobs: true,
    playerOnly: false,
  },
  polished_blackstone: {
    kind: 'polished_blackstone',
    minEntities: 1,
    triggersOnItems: false,
    triggersOnMobs: false,
    playerOnly: true,
  },
  light_weighted: {
    kind: 'light_weighted',
    minEntities: 0,
    triggersOnItems: true,
    triggersOnMobs: true,
    playerOnly: false,
  },
  heavy_weighted: {
    kind: 'heavy_weighted',
    minEntities: 0,
    triggersOnItems: true,
    triggersOnMobs: true,
    playerOnly: false,
  },
};

export interface PressureQuery {
  kind: PressurePlateKind;
  playerCount: number;
  mobCount: number;
  itemCount: number;
}

export function plateSignal(q: PressureQuery): number {
  const def = PLATE_DEFS[q.kind];
  let relevantCount = 0;
  if (def.playerOnly) {
    relevantCount = q.playerCount;
  } else {
    relevantCount =
      q.playerCount +
      (def.triggersOnMobs ? q.mobCount : 0) +
      (def.triggersOnItems ? q.itemCount : 0);
  }
  if (q.kind === 'light_weighted') {
    return Math.min(15, Math.max(0, relevantCount));
  }
  if (q.kind === 'heavy_weighted') {
    return Math.min(15, Math.floor(relevantCount / 10));
  }
  return relevantCount >= def.minEntities ? 15 : 0;
}
