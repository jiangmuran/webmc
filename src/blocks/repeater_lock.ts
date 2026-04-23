export interface Ctx {
  sideRepeaterPowered: boolean;
  wasPowered: boolean;
}

export function isLocked(c: Ctx): boolean {
  return c.sideRepeaterPowered;
}

export function output(inputPowered: boolean, c: Ctx): boolean {
  return isLocked(c) ? c.wasPowered : inputPowered;
}
