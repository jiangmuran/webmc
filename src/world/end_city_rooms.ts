// End city room tags for jigsaw assembly.

export type EndCityRoom =
  | 'base_floor'
  | 'tower_segment'
  | 'bridge'
  | 'treasure_room'
  | 'ship'
  | 'garden'
  | 'balcony'
  | 'corridor';

export const ROOM_WEIGHT: Record<EndCityRoom, number> = {
  base_floor: 15,
  tower_segment: 20,
  bridge: 8,
  treasure_room: 3,
  ship: 1,
  garden: 5,
  balcony: 6,
  corridor: 10,
};

export function shipSpawnProbability(): number {
  return 0.25;
}

export function countTreasureRooms(): number {
  return 3;
}

export function totalRoomWeight(): number {
  return Object.values(ROOM_WEIGHT).reduce((a, b) => a + b, 0);
}
