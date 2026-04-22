// Redstone torch burns out if it rapidly toggles (4 or more flips
// within 60 ticks). Stays off until nearby block updates.

export interface TorchState {
  on: boolean;
  recentFlipTicks: number[]; // tick timestamps of last flips
  burnedOut: boolean;
}

export const TORCH_BURNOUT_WINDOW = 60;
export const TORCH_BURNOUT_THRESHOLD = 4;

export function flip(s: TorchState, nowTick: number): TorchState {
  const recent = s.recentFlipTicks.filter((t) => nowTick - t < TORCH_BURNOUT_WINDOW);
  recent.push(nowTick);
  if (recent.length >= TORCH_BURNOUT_THRESHOLD) {
    return { ...s, on: false, recentFlipTicks: recent, burnedOut: true };
  }
  return { ...s, on: !s.on, recentFlipTicks: recent };
}

export function onBlockUpdate(s: TorchState): TorchState {
  if (!s.burnedOut) return s;
  return { on: true, recentFlipTicks: [], burnedOut: false };
}

export function outputPower(s: TorchState): number {
  return s.on ? 15 : 0;
}
