// Wolf taming. Feed bones to wild wolf; each bone has ~1/3 chance to
// tame. Tamed wolf gets red collar, sits/follows, attacks threats.

export const TAME_CHANCE_PER_BONE = 1 / 3;

export interface WolfState {
  tamed: boolean;
  owner: string | null;
  sitting: boolean;
  collarColor: string;
}

export function feedBone(w: WolfState, playerId: string, rand: () => number): WolfState {
  if (w.tamed) return w;
  if (rand() >= TAME_CHANCE_PER_BONE) return w;
  return { ...w, tamed: true, owner: playerId, collarColor: 'red' };
}

export function setSit(w: WolfState, playerId: string, sit: boolean): WolfState {
  if (w.owner !== playerId) return w;
  return { ...w, sitting: sit };
}

export function dyeCollar(w: WolfState, playerId: string, color: string): WolfState {
  if (w.owner !== playerId) return w;
  return { ...w, collarColor: color };
}

export function isHostileToTarget(w: WolfState, target: string): boolean {
  if (!w.tamed) return false;
  return (
    target === 'skeleton' || target === 'skeleton_horse' || target === 'rabbit' || target === 'fox'
  );
}
