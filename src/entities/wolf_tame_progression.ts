// Wolf taming. Feeding a wild wolf a bone has ~1/3 chance of taming.
// After tame: sits, follows, can be given a colored collar.

export interface WildWolf {
  hostile: boolean;
  angerTicks: number;
}

export interface TamedWolf {
  ownerId: string;
  sitting: boolean;
  collarColor: string;
}

export const TAME_CHANCE_PER_BONE = 1 / 3;

export interface BoneFeedQuery {
  playerId: string;
  rand: () => number;
}

export interface FeedResult {
  tamed: boolean;
  newWolf: TamedWolf | null;
}

export function feedBone(_w: WildWolf, q: BoneFeedQuery): FeedResult {
  if (q.rand() < TAME_CHANCE_PER_BONE) {
    return {
      tamed: true,
      newWolf: { ownerId: q.playerId, sitting: false, collarColor: 'red' },
    };
  }
  return { tamed: false, newWolf: null };
}

// Sit/stand toggle.
export function toggleSit(w: TamedWolf): boolean {
  w.sitting = !w.sitting;
  return w.sitting;
}

// Breeding two tamed wolves: both must have been fed meat recently;
// outputs a pup.
//
// Wiki (minecraft.wiki/w/Wolf#Breeding): "Tamed wolves at full
// health can be bred with any type of meat… In order to breed,
// both wolves must be standing… If two tamed wolves have different
// owners, the baby is randomly assigned to one of their two owners
// as its permanent owner."
//
// So wiki canon: tamed wolves can breed regardless of owner — the
// offspring just gets a random parent's owner. Old canBreedWolves
// rejected breeding when owners differed, contradicting canon.
// Both wolves must also not be sitting per the wiki's "standing"
// requirement.
export interface BreedQuery {
  a: TamedWolf;
  b: TamedWolf;
  aFed: boolean;
  bFed: boolean;
}

export function canBreedWolves(q: BreedQuery): boolean {
  if (!q.aFed || !q.bFed) return false;
  if (q.a.sitting || q.b.sitting) return false;
  return true;
}
