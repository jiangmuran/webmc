// Turtle shell helmet. Crafted from 5 scutes in a helmet pattern; wearing
// it gives Water Breathing (10 seconds extended breath in water). Also
// used as the base ingredient for Potion of Turtle Master.

export interface TurtleShellState {
  equipped: boolean;
  durability: number;
  maxDurability: number;
}

export function makeTurtleShell(): TurtleShellState {
  return { equipped: false, durability: 276, maxDurability: 276 };
}

export const WATER_BREATHING_BONUS_SEC = 10;

export function equipTurtleShell(state: TurtleShellState): void {
  state.equipped = true;
}

export function extendBreath(
  state: TurtleShellState,
  currentBreath: number,
  maxBreath: number,
): number {
  if (!state.equipped) return currentBreath;
  return Math.min(maxBreath + WATER_BREATHING_BONUS_SEC, currentBreath + 1);
}

// Potion of Turtle Master: Slowness IV + Resistance III for 20 seconds.
export interface TurtleMasterEffect {
  id: string;
  amplifier: number;
  durationSec: number;
}

export function turtleMasterEffects(): readonly TurtleMasterEffect[] {
  return [
    { id: 'slowness', amplifier: 3, durationSec: 20 },
    { id: 'resistance', amplifier: 2, durationSec: 20 },
  ];
}
