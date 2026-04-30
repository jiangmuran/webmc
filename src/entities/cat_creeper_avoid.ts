// Wiki (minecraft.wiki/w/Creeper): "Creepers flee from ocelots and
// cats within a 6-block radius." Old constant 16 was ~3× the wiki
// value — creepers fled from cats much further than canon, making
// cat-shielding far too effective.
export interface CreeperCtx {
  catNearby: boolean;
  catDistance: number;
  panicking: boolean;
}

export const CAT_AVOID_DISTANCE = 6;

export function avoidsPlayer(c: CreeperCtx): boolean {
  if (!c.catNearby) return false;
  return c.catDistance < CAT_AVOID_DISTANCE;
}

export function panicking(c: CreeperCtx): boolean {
  return avoidsPlayer(c);
}
