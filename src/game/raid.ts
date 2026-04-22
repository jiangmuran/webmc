// Pillager raid. Triggered by a player with "Bad Omen" entering a village.
// Raids have N waves; each wave spawns a mob lineup. Captain kills give
// Bad Omen. Raid ends when (a) all waves complete, (b) all raiders killed,
// or (c) village destroyed.

import type { MobKind } from '@/entities/mob';

export interface WavePlan {
  readonly wave: number;
  readonly spawns: readonly { kind: MobKind; count: number }[];
}

export const RAID_WAVES: readonly WavePlan[] = [
  {
    wave: 1,
    spawns: [
      { kind: 'pillager', count: 4 },
      { kind: 'vindicator', count: 1 },
    ],
  },
  {
    wave: 2,
    spawns: [
      { kind: 'pillager', count: 3 },
      { kind: 'vindicator', count: 2 },
    ],
  },
  {
    wave: 3,
    spawns: [
      { kind: 'pillager', count: 2 },
      { kind: 'vindicator', count: 2 },
      { kind: 'evoker', count: 1 },
    ],
  },
  {
    wave: 4,
    spawns: [
      { kind: 'pillager', count: 3 },
      { kind: 'vindicator', count: 2 },
      { kind: 'evoker', count: 1 },
    ],
  },
  {
    wave: 5,
    spawns: [
      { kind: 'pillager', count: 4 },
      { kind: 'vindicator', count: 3 },
      { kind: 'evoker', count: 2 },
    ],
  },
];

export type RaidStatus = 'inactive' | 'active' | 'won' | 'lost';

export interface RaidState {
  status: RaidStatus;
  currentWave: number; // 1..5 while active
  spawnedCount: number; // mobs spawned in the current wave
  liveCount: number; // raiders currently alive (caller updates)
  villageHealth: number; // 0..1, 0 = destroyed
  badOmenLevel: number; // determines starting + bonus waves
}

export function makeRaid(badOmenLevel: number): RaidState {
  return {
    status: 'active',
    currentWave: 1,
    spawnedCount: 0,
    liveCount: 0,
    villageHealth: 1,
    badOmenLevel,
  };
}

// Total waves scale with Bad Omen level: base 3 waves + (level - 1).
export function totalWaves(state: RaidState): number {
  return Math.min(RAID_WAVES.length, 3 + Math.max(0, state.badOmenLevel - 1));
}

export function currentWavePlan(state: RaidState): WavePlan | null {
  if (state.status !== 'active') return null;
  if (state.currentWave > totalWaves(state)) return null;
  return RAID_WAVES[state.currentWave - 1] ?? null;
}

export interface RaidTickResult {
  advancedWave: boolean;
  ended: RaidStatus | null;
}

export function tickRaid(state: RaidState): RaidTickResult {
  if (state.status !== 'active') return { advancedWave: false, ended: null };
  if (state.villageHealth <= 0) {
    state.status = 'lost';
    return { advancedWave: false, ended: 'lost' };
  }
  const plan = currentWavePlan(state);
  if (!plan) {
    state.status = 'won';
    return { advancedWave: false, ended: 'won' };
  }
  const totalInWave = plan.spawns.reduce((s, g) => s + g.count, 0);
  if (state.spawnedCount >= totalInWave && state.liveCount === 0) {
    state.currentWave++;
    state.spawnedCount = 0;
    if (state.currentWave > totalWaves(state)) {
      state.status = 'won';
      return { advancedWave: false, ended: 'won' };
    }
    return { advancedWave: true, ended: null };
  }
  return { advancedWave: false, ended: null };
}
