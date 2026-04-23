export interface Trap {
  pressurePlateActive: boolean;
  tntPrimed: boolean;
}

export const TNT_COUNT = 9;

export function triggers(t: Trap): boolean {
  return t.pressurePlateActive;
}

export function lootChestCount(): number {
  return 4;
}

export function treasureRoomDepthY(): number {
  return -5;
}
