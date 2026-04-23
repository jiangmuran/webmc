export interface BeachCtx {
  onSand: boolean;
  waterNearby: boolean;
  daytime: boolean;
}

export function canLayEgg(c: BeachCtx): boolean {
  if (!c.onSand) return false;
  if (!c.waterNearby) return false;
  return c.daytime;
}

export function scuteDroppedAtAdult(): string {
  return 'turtle_scute';
}

export function homeBeachReturnsAt(): 'lay' | 'follow' {
  return 'lay';
}
