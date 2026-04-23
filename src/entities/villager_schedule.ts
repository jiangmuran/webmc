// Villager daily schedule (simplified).
// dawn: wake, gather at meeting point
// work: at workstation
// noon: socialize
// dusk: return to bed
// night: sleep in bed

export type VillagerActivity = 'sleep' | 'rise' | 'work' | 'socialize' | 'return_to_bed';

export function activityAt(tickOfDay: number, isBabyVillager: boolean): VillagerActivity {
  const t = ((tickOfDay % 24000) + 24000) % 24000;
  if (isBabyVillager) {
    // Baby villagers play all day; sleep at night.
    if (t >= 13000) return 'sleep';
    return 'socialize';
  }
  if (t < 2000) return 'rise';
  if (t < 9000) return 'work';
  if (t < 11000) return 'socialize';
  if (t < 13000) return 'return_to_bed';
  return 'sleep';
}

export function shouldSeekBedNow(act: VillagerActivity): boolean {
  return act === 'return_to_bed' || act === 'sleep';
}
