export interface Title {
  title: string;
  subtitle?: string;
  fadeInTicks: number;
  stayTicks: number;
  fadeOutTicks: number;
}

export const DEFAULT_FADE_IN = 10;
export const DEFAULT_STAY = 70;
export const DEFAULT_FADE_OUT = 20;

export function totalTicks(t: Title): number {
  return t.fadeInTicks + t.stayTicks + t.fadeOutTicks;
}

export function alphaAt(t: Title, nowTick: number): number {
  if (nowTick < 0) return 0;
  if (nowTick < t.fadeInTicks) return nowTick / t.fadeInTicks;
  if (nowTick < t.fadeInTicks + t.stayTicks) return 1;
  const fadeStart = t.fadeInTicks + t.stayTicks;
  const inFade = nowTick - fadeStart;
  if (inFade >= t.fadeOutTicks) return 0;
  return 1 - inFade / t.fadeOutTicks;
}
