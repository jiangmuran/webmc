// Ocelot trust. Unlike cats, ocelots in modern MC are not tamed:
// feeding raw fish repeatedly raises "trust" up to maxTrust, after
// which they no longer flee. They never become tame/rideable.

export interface Ocelot {
  trust: number; // 0..MAX
  lastFedMs: number;
}

export const MAX_TRUST = 6;
export const FEED_COOLDOWN_MS = 200;

export function makeOcelot(): Ocelot {
  return { trust: 0, lastFedMs: -Infinity };
}

export interface FeedQuery {
  item: string;
  nowMs: number;
  rand: () => number;
}

const TRUST_FOOD = new Set<string>(['webmc:raw_cod', 'webmc:raw_salmon']);

export function feed(o: Ocelot, q: FeedQuery): 'accepted' | 'rejected' | 'cooldown' | 'trusted' {
  if (!TRUST_FOOD.has(q.item)) return 'rejected';
  if (q.nowMs - o.lastFedMs < FEED_COOLDOWN_MS) return 'cooldown';
  o.lastFedMs = q.nowMs;
  if (o.trust >= MAX_TRUST) return 'trusted';
  if (q.rand() < 1 / 3) o.trust += 1;
  return 'accepted';
}

export function trusts(o: Ocelot): boolean {
  return o.trust >= MAX_TRUST;
}

// Proximity to a trusting ocelot scares nearby phantoms and creepers
// (they keep distance). Exposed as a radius.
export const SCARE_RADIUS_CREEPER = 6;
