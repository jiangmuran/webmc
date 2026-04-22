// Bee nest / hive. Holds up to 3 bees. Bees exit at daytime or on smoke
// interaction; they return to deposit honey/pollen. When honey level
// reaches 5, the hive can be sheared for 3 honeycombs (pacifies bees if
// a campfire is below).

export type NestKind = 'bee_nest' | 'beehive';

export interface NestState {
  kind: NestKind;
  capacity: number; // fixed at 3
  occupants: number;
  honeyLevel: 0 | 1 | 2 | 3 | 4 | 5;
  campfireBelow: boolean;
}

export function makeNest(kind: NestKind = 'beehive'): NestState {
  return { kind, capacity: 3, occupants: 0, honeyLevel: 0, campfireBelow: false };
}

export interface BeeReturnCtx {
  beeCarriesPollen: boolean;
}

export interface BeeReturnResult {
  accepted: boolean;
  honeyDelta: number;
}

export function onBeeReturn(state: NestState, ctx: BeeReturnCtx): BeeReturnResult {
  if (state.occupants >= state.capacity) {
    return { accepted: false, honeyDelta: 0 };
  }
  state.occupants++;
  const honeyDelta = ctx.beeCarriesPollen ? 1 : 0;
  const next = Math.min(5, state.honeyLevel + honeyDelta) as NestState['honeyLevel'];
  const delta = next - state.honeyLevel;
  state.honeyLevel = next;
  return { accepted: true, honeyDelta: delta };
}

export interface ShearQuery {
  toolIsShears: boolean;
  playerSafe: boolean; // campfire below or not provoking bees
}

export interface ShearResult {
  honeycombsDropped: number;
  beesAngered: boolean;
}

export function shearNest(state: NestState, q: ShearQuery): ShearResult {
  if (!q.toolIsShears || state.honeyLevel < 5) {
    return { honeycombsDropped: 0, beesAngered: false };
  }
  state.honeyLevel = 0;
  const angered = !q.playerSafe && !state.campfireBelow;
  return { honeycombsDropped: 3, beesAngered: angered };
}

export interface BottleQuery {
  bottleCount: number;
  playerSafe: boolean;
}

export interface BottleResult {
  honeyBottles: number;
  beesAngered: boolean;
}

export function bottleHoney(state: NestState, q: BottleQuery): BottleResult {
  if (q.bottleCount < 1 || state.honeyLevel < 5) {
    return { honeyBottles: 0, beesAngered: false };
  }
  state.honeyLevel = 0;
  const angered = !q.playerSafe && !state.campfireBelow;
  return { honeyBottles: 1, beesAngered: angered };
}

// Smoke from a campfire below pacifies bees; shearing/bottling while
// smoke is active doesn't anger them.
export function applyCampfireSmoke(state: NestState, hasCampfire: boolean): void {
  state.campfireBelow = hasCampfire;
}
