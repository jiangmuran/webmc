// Warped fungus on a stick: steers saddled striders. Each use increases
// boost counter; tool durability decreases.

export interface FungusStick {
  durability: number;
  maxDurability: number;
}

export const FUNGUS_STICK_MAX = 100;

export interface StriderControl {
  targetDirection: { yaw: number; pitch: number };
  boostTicks: number;
}

export function use(stick: FungusStick, yaw: number, pitch: number): StriderControl | null {
  if (stick.durability <= 0) return null;
  stick.durability--;
  return { targetDirection: { yaw, pitch }, boostTicks: 10 };
}

export function craft(): FungusStick {
  return { durability: FUNGUS_STICK_MAX, maxDurability: FUNGUS_STICK_MAX };
}

// Only Striders accept this steering.
export function steersMob(mobType: string): boolean {
  return mobType === 'strider';
}
