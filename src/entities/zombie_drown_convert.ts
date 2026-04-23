export interface ZombieDrownCtx {
  underwaterTicks: number;
  headInWater: boolean;
}

export const CONVERT_TICKS = 600;

export function shouldConvert(c: ZombieDrownCtx): boolean {
  return c.headInWater && c.underwaterTicks >= CONVERT_TICKS;
}

export function convertedTo(): string {
  return 'drowned';
}

export function shakesWhileConverting(c: ZombieDrownCtx): boolean {
  return c.headInWater && c.underwaterTicks >= CONVERT_TICKS * 0.5;
}
