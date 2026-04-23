export interface PumpkinHelmetCtx {
  wearing: boolean;
  lookingAtEnderman: boolean;
}

export const DISTORTION_ALPHA = 0.4;

export function hudDistortionAlpha(c: PumpkinHelmetCtx): number {
  return c.wearing ? DISTORTION_ALPHA : 0;
}

export function endermanAggroOnStare(c: PumpkinHelmetCtx): boolean {
  return c.wearing ? false : c.lookingAtEnderman;
}

export function usableAsHelmet(): boolean {
  return true;
}
