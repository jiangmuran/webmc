// Ocelot trust. Unlike cats, ocelots aren't tameable. Feeding raw fish
// builds trust: enough trust = ocelots stop fleeing the player (they
// stay trusting but don't become pets).

export interface OcelotState {
  trustLevel: number; // 0..100
  playerId: number | null;
}

export function makeOcelot(): OcelotState {
  return { trustLevel: 0, playerId: null };
}

export interface FeedQuery {
  playerId: number;
  itemName: string;
  rng: () => number;
}

export interface FeedResult {
  itemConsumed: boolean;
  trusted: boolean;
}

const TRUST_ITEMS = new Set(['webmc:raw_fish', 'webmc:raw_salmon']);
const TRUST_GAIN_CHANCE = 1 / 3;

export function feedOcelot(state: OcelotState, q: FeedQuery): FeedResult {
  if (!TRUST_ITEMS.has(q.itemName)) return { itemConsumed: false, trusted: false };
  if (state.playerId !== null && state.playerId !== q.playerId) {
    return { itemConsumed: false, trusted: false };
  }
  state.playerId = q.playerId;
  if (q.rng() < TRUST_GAIN_CHANCE) {
    state.trustLevel = Math.min(100, state.trustLevel + 25);
  }
  return { itemConsumed: true, trusted: state.trustLevel >= 75 };
}

export function isTrusting(state: OcelotState): boolean {
  return state.trustLevel >= 75;
}
