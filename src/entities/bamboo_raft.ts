// Bamboo raft: visually distinct boat; behaves like ordinary boats.

export function isRaft(boatType: string): boolean {
  return boatType === 'bamboo_raft' || boatType === 'bamboo_chest_raft';
}

export function hasChest(boatType: string): boolean {
  return boatType.endsWith('_chest_raft') || boatType.endsWith('_chest_boat');
}

export const RAFT_SEAT_COUNT = 2;

export function baseSpeedMult(): number {
  // rafts are ~5% slower than boats on water (official tuning).
  return 0.95;
}
