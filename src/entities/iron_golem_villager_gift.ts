// Iron golems: villagers can place a poppy or other flower in a golem's
// hand as a gift. Golems wander, holding flower toward villager children.

export interface IronGolem {
  hp: number;
  holdingFlower: boolean;
  lastGiftGivenTick: number;
}

export const MAX_HP = 100;
export const GIFT_COOLDOWN_TICKS = 400; // 20s

export function makeIronGolem(): IronGolem {
  return { hp: MAX_HP, holdingFlower: false, lastGiftGivenTick: -Infinity };
}

export interface GiftQuery {
  nowTick: number;
  villagerAdultPresent: boolean;
  childNearby: boolean;
  rand: () => number;
}

export function tryGrabFlower(g: IronGolem, q: GiftQuery): boolean {
  if (g.holdingFlower) return false;
  if (!q.villagerAdultPresent) return false;
  if (q.nowTick - g.lastGiftGivenTick < GIFT_COOLDOWN_TICKS) return false;
  if (q.rand() < 0.01) {
    g.holdingFlower = true;
    return true;
  }
  return false;
}

export interface GiveQuery {
  childNearby: boolean;
  nowTick: number;
}

export function tryGiveFlower(g: IronGolem, q: GiveQuery): boolean {
  if (!g.holdingFlower) return false;
  if (!q.childNearby) return false;
  g.holdingFlower = false;
  g.lastGiftGivenTick = q.nowTick;
  return true;
}

// HP regen from iron ingot (heals 25).
export function ironRepair(g: IronGolem): boolean {
  if (g.hp >= MAX_HP) return false;
  g.hp = Math.min(MAX_HP, g.hp + 25);
  return true;
}
