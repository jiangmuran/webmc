export function smokeHeight(hayBaleBelow: boolean): number {
  return hayBaleBelow ? 24 : 10;
}

export function signalFireRange(): number {
  return 24;
}

export function isSignalFire(lit: boolean, hayBaleBelow: boolean): boolean {
  return lit && hayBaleBelow;
}
