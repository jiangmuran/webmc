export interface BeachCtx {
  onSand: boolean;
  waterNearby: boolean;
  /** @deprecated wiki says no time-of-day requirement; ignored. */
  daytime?: boolean;
}

// Wiki (minecraft.wiki/w/Turtle#Egg_laying): "Upon arrival [at the
// home beach], it seeks a nearby sand block on which to lay its eggs.
// Then, it spends a few seconds digging vigorously ... Finally, it
// lays a cluster of 1-4 turtle eggs, as a single block."
//
// Wiki imposes NO time-of-day constraint on egg laying — turtles lay
// eggs at any time. Old `return c.daytime` blocked nighttime laying,
// which is incorrect per wiki. Removed entirely.
export function canLayEgg(c: BeachCtx): boolean {
  if (!c.onSand) return false;
  if (!c.waterNearby) return false;
  return true;
}

export function scuteDroppedAtAdult(): string {
  return 'turtle_scute';
}

export function homeBeachReturnsAt(): 'lay' | 'follow' {
  return 'lay';
}
