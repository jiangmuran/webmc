export type VillagerActivity = 'work' | 'meet' | 'rest' | 'play' | 'idle' | 'panic' | 'raid';

export interface Schedule {
  startTick: number;
  activity: VillagerActivity;
}

export const ADULT_SCHEDULE: readonly Schedule[] = [
  { startTick: 2000, activity: 'work' },
  { startTick: 9000, activity: 'meet' },
  { startTick: 11000, activity: 'work' },
  { startTick: 12000, activity: 'rest' },
];

export const CHILD_SCHEDULE: readonly Schedule[] = [
  { startTick: 2000, activity: 'play' },
  { startTick: 10000, activity: 'meet' },
  { startTick: 12000, activity: 'rest' },
];

export function activityAt(timeOfDay: number, isBaby: boolean): VillagerActivity {
  const t = ((timeOfDay % 24000) + 24000) % 24000;
  const schedule = isBaby ? CHILD_SCHEDULE : ADULT_SCHEDULE;
  let current: VillagerActivity = schedule[schedule.length - 1]?.activity ?? 'idle';
  for (const entry of schedule) {
    if (t >= entry.startTick) current = entry.activity;
    else break;
  }
  return current;
}

export function overrideForPanic(hasThreat: boolean): VillagerActivity | undefined {
  return hasThreat ? 'panic' : undefined;
}
