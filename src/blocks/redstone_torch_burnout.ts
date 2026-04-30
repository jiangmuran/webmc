// Redstone torch burns out if it rapidly toggles. Stays off until a
// nearby block update arrives.
//
// Wiki (minecraft.wiki/w/Redstone_Torch): a torch experiences burnout
// when forced to turn off **more than eight times** in 60 game ticks
// — i.e. the 9th turn-off in the window is the trip. Old threshold
// was 4, ~2× too sensitive: hand-built clocks that should have run
// reliably (the 3-torch loop the wiki specifically calls out as fixed
// in 1.2 once the window dropped to 60 ticks) were burning out on the
// 4th flip instead.

export interface TorchState {
  on: boolean;
  recentFlipTicks: number[]; // tick timestamps of last flips
  burnedOut: boolean;
}

export const TORCH_BURNOUT_WINDOW = 60;
export const TORCH_BURNOUT_THRESHOLD = 9;

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
