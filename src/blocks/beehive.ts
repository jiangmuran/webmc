// Beehive. 5 honey levels, 0..5. Shearing drops honeycomb, bottle
// harvests honey; both empty the hive and agitate bees.

export interface BeehiveState {
  honeyLevel: number; // 0..5
  boundBeeIds: number[]; // bees sheltering inside
  agitated: boolean; // set when harvested without campfire
}

const MAX_HONEY = 5;
const MAX_BEES = 3;

export function makeBeehive(): BeehiveState {
  return { honeyLevel: 0, boundBeeIds: [], agitated: false };
}

export function enterHive(state: BeehiveState, beeId: number): boolean {
  if (state.boundBeeIds.length >= MAX_BEES) return false;
  state.boundBeeIds.push(beeId);
  return true;
}

export function leaveHive(state: BeehiveState): number | null {
  return state.boundBeeIds.shift() ?? null;
}

// Called during any bee's "pollinate → return" cycle. Honey level rises.
export function addPollination(state: BeehiveState): void {
  state.honeyLevel = Math.min(MAX_HONEY, state.honeyLevel + 1);
}

export interface HarvestQuery {
  useBottle: boolean; // glass bottle = honey bottle, shears = honeycomb
  campfireBelow: boolean;
}

export interface HarvestResult {
  drop: string | null;
  agitated: boolean;
}

export function harvest(state: BeehiveState, q: HarvestQuery): HarvestResult {
  if (state.honeyLevel < MAX_HONEY) return { drop: null, agitated: false };
  const drop = q.useBottle ? 'webmc:honey_bottle' : 'webmc:honeycomb';
  state.honeyLevel = 0;
  if (!q.campfireBelow) {
    state.agitated = true;
    return { drop, agitated: true };
  }
  return { drop, agitated: false };
}
