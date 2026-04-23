export interface Ctx {
  isFalling: boolean;
  touchingWater: boolean;
  color: string;
}

export function hardensToConcrete(c: Ctx): boolean {
  return c.touchingWater;
}

export function concreteName(color: string): string {
  return `${color}_concrete`;
}

export function affectedByGravity(): boolean {
  return true;
}
