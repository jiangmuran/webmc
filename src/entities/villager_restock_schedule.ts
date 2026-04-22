// Villager daily schedule: work → gather → sleep. A villager restocks
// at workstation during "work" phase of its schedule. Villagers work
// up to twice per MC day (morning and afternoon).

export type Activity = 'rest' | 'work' | 'play' | 'meet' | 'sleep';

// MC-day is 24000 ticks. 0 = dawn.
export function currentActivity(tick: number, isChild: boolean): Activity {
  const t = ((tick % 24000) + 24000) % 24000;
  if (t >= 12000 && t < 23000) return 'sleep';
  if (isChild) {
    if (t < 2000) return 'rest';
    if (t < 10000) return 'play';
    return 'meet';
  }
  if (t < 2000) return 'rest';
  if (t < 9000) return 'work';
  return 'meet';
}

export interface RestockState {
  restocksToday: number;
  lastDayIndex: number;
}

export const MAX_RESTOCKS_PER_DAY = 2;

export function tryRestock(s: RestockState, tick: number): boolean {
  const day = Math.floor(tick / 24000);
  if (day !== s.lastDayIndex) {
    s.restocksToday = 0;
    s.lastDayIndex = day;
  }
  if (currentActivity(tick, false) !== 'work') return false;
  if (s.restocksToday >= MAX_RESTOCKS_PER_DAY) return false;
  s.restocksToday += 1;
  return true;
}
