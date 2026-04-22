// Disconnect reasons. Centralized list so host + client share symbol
// names; each reason has a display string (via translation) and a hint
// about whether the client should retry.

export type DisconnectReason =
  | 'client_left'
  | 'host_closed_session'
  | 'host_kicked'
  | 'host_banned'
  | 'host_crashed'
  | 'protocol_mismatch'
  | 'auth_failed'
  | 'rate_limited'
  | 'transport_error'
  | 'timeout'
  | 'room_closed'
  | 'server_full';

export interface DisconnectInfo {
  reason: DisconnectReason;
  messageKey: string;
  retriable: boolean;
  backoffSec: number;
}

const TABLE: Record<DisconnectReason, DisconnectInfo> = {
  client_left: {
    reason: 'client_left',
    messageKey: 'multiplayer.disconnect.leave',
    retriable: true,
    backoffSec: 0,
  },
  host_closed_session: {
    reason: 'host_closed_session',
    messageKey: 'multiplayer.disconnect.host_end',
    retriable: false,
    backoffSec: 0,
  },
  host_kicked: {
    reason: 'host_kicked',
    messageKey: 'multiplayer.disconnect.kicked',
    retriable: false,
    backoffSec: 0,
  },
  host_banned: {
    reason: 'host_banned',
    messageKey: 'multiplayer.disconnect.banned',
    retriable: false,
    backoffSec: 0,
  },
  host_crashed: {
    reason: 'host_crashed',
    messageKey: 'multiplayer.disconnect.host_crashed',
    retriable: true,
    backoffSec: 5,
  },
  protocol_mismatch: {
    reason: 'protocol_mismatch',
    messageKey: 'multiplayer.disconnect.incompatible',
    retriable: false,
    backoffSec: 0,
  },
  auth_failed: {
    reason: 'auth_failed',
    messageKey: 'multiplayer.disconnect.auth_failed',
    retriable: false,
    backoffSec: 0,
  },
  rate_limited: {
    reason: 'rate_limited',
    messageKey: 'multiplayer.disconnect.rate_limited',
    retriable: true,
    backoffSec: 30,
  },
  transport_error: {
    reason: 'transport_error',
    messageKey: 'multiplayer.disconnect.transport',
    retriable: true,
    backoffSec: 3,
  },
  timeout: {
    reason: 'timeout',
    messageKey: 'multiplayer.disconnect.timeout',
    retriable: true,
    backoffSec: 3,
  },
  room_closed: {
    reason: 'room_closed',
    messageKey: 'multiplayer.disconnect.room_closed',
    retriable: false,
    backoffSec: 0,
  },
  server_full: {
    reason: 'server_full',
    messageKey: 'multiplayer.disconnect.server_full',
    retriable: true,
    backoffSec: 60,
  },
};

export function infoFor(reason: DisconnectReason): DisconnectInfo {
  return TABLE[reason];
}

export function isRetriable(reason: DisconnectReason): boolean {
  return TABLE[reason].retriable;
}

export function backoffFor(reason: DisconnectReason): number {
  return TABLE[reason].backoffSec;
}

// Exponential backoff helper for retries: 1.5× backoff each attempt,
// capped at 5 minutes.
export function nextBackoff(previous: number, reason: DisconnectReason): number {
  const base = backoffFor(reason);
  if (!isRetriable(reason)) return Infinity;
  return Math.min(300, Math.max(base, previous * 1.5));
}
