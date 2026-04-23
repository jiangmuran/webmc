import { describe, it, expect } from 'vitest';
import {
  ROOM_WEIGHT,
  shipSpawnProbability,
  countTreasureRooms,
  totalRoomWeight,
} from './end_city_rooms';

describe('end city rooms', () => {
  it('ship rare', () => {
    expect(ROOM_WEIGHT.ship).toBe(1);
  });

  it('tower most common', () => {
    expect(ROOM_WEIGHT.tower_segment).toBeGreaterThan(ROOM_WEIGHT.ship);
  });

  it('ship probability 0..1', () => {
    expect(shipSpawnProbability()).toBeGreaterThan(0);
    expect(shipSpawnProbability()).toBeLessThan(1);
  });

  it('treasure rooms', () => {
    expect(countTreasureRooms()).toBe(3);
  });

  it('total weight positive', () => {
    expect(totalRoomWeight()).toBeGreaterThan(0);
  });
});
