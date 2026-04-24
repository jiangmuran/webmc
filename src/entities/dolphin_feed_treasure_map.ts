export interface DolphinState {
  gotFish: boolean;
  leadingPlayer?: string;
  targetStructure?: 'shipwreck' | 'buried_treasure' | 'ocean_ruin';
}

export function feed(s: DolphinState, playerId: string): DolphinState {
  return {
    ...s,
    gotFish: true,
    leadingPlayer: playerId,
    targetStructure: s.targetStructure ?? 'shipwreck',
  };
}

export function isLeading(s: DolphinState): boolean {
  return s.gotFish && s.leadingPlayer !== undefined;
}

export function targetAfterFirstReached(
  current: DolphinState['targetStructure'],
): DolphinState['targetStructure'] {
  if (current === 'shipwreck') return 'buried_treasure';
  return undefined;
}
