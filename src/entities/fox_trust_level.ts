// Fox trust. Fox cubs bred by player are "trusting"; adult trust only
// if they grew up trusted. Trusting foxes don't flee, accept sweet berries.

export interface FoxTrust {
  trustingPlayers: Set<string>;
  isBaby: boolean;
}

export function makeFox(isBaby = true): FoxTrust {
  return { trustingPlayers: new Set(), isBaby };
}

export function onBredByPlayer(f: FoxTrust, playerId: string): void {
  if (f.isBaby) f.trustingPlayers.add(playerId);
}

export function trustsPlayer(f: FoxTrust, playerId: string): boolean {
  return f.trustingPlayers.has(playerId);
}

export function fleesFrom(f: FoxTrust, playerId: string): boolean {
  if (trustsPlayer(f, playerId)) return false;
  return true;
}

export function canPickUpDroppedItem(): boolean {
  return true;
}
