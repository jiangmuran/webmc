export interface TridentState {
  loyaltyLevel: number;
  thrownPos: { x: number; y: number; z: number };
  ownerPos: { x: number; y: number; z: number };
  nowTick: number;
  thrownAtTick: number;
}

export const RETURN_SPEED_PER_LEVEL = 0.05;

export function shouldReturn(t: TridentState): boolean {
  return t.loyaltyLevel > 0 && t.nowTick - t.thrownAtTick > 40;
}

export function returnSpeed(t: TridentState): number {
  return t.loyaltyLevel * RETURN_SPEED_PER_LEVEL;
}

export function reachedOwner(t: TridentState): boolean {
  const d = Math.hypot(
    t.thrownPos.x - t.ownerPos.x,
    t.thrownPos.y - t.ownerPos.y,
    t.thrownPos.z - t.ownerPos.z,
  );
  return d < 1.5;
}
