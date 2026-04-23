export interface FoxState {
  isNocturnal: boolean;
  timeOfDayTicks: number;
  hasShelterAbove: boolean;
}

export const DAY_START = 0;
export const NIGHT_START = 13000;
export const DAY_END = 23000;

export function isDaytime(t: number): boolean {
  const wrapped = ((t % 24000) + 24000) % 24000;
  return wrapped < NIGHT_START || wrapped >= DAY_END;
}

export function shouldSleep(s: FoxState): boolean {
  const day = isDaytime(s.timeOfDayTicks);
  return s.isNocturnal ? day && s.hasShelterAbove : !day;
}
