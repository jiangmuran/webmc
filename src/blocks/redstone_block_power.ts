export const POWER_LEVEL = 15;

export function emitsPower(): number {
  return POWER_LEVEL;
}

export function poweredWhilePushedByPiston(): boolean {
  return true;
}

export function noPowerLossToAdjacentBlocks(): boolean {
  return false;
}
