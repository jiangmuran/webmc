export interface LlamaState {
  leashedToTraderTick: number;
  followingOther: boolean;
}

export const CARAVAN_LENGTH_MAX = 10;

export function joinsCaravan(s: LlamaState, wanderingTrader: boolean): boolean {
  return wanderingTrader && !s.followingOther;
}

export function caravanLongerThanMax(count: number): boolean {
  return count > CARAVAN_LENGTH_MAX;
}

export function strayAfterDisconnect(s: LlamaState, ticksAway: number): boolean {
  return s.followingOther && ticksAway > 600;
}
