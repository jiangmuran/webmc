// Disconnect policy. On host leave, all clients are dropped with a
// reason. On peer drop, pause that peer's entity until reconnect grace.

export type DisconnectReason =
  | 'host_leave'
  | 'idle_timeout'
  | 'kicked'
  | 'server_shutdown'
  | 'client_quit'
  | 'network_error';

export const RECONNECT_GRACE_MS = 30_000;

export function isRetriable(r: DisconnectReason): boolean {
  return r === 'network_error' || r === 'idle_timeout';
}

export function shouldPauseEntity(r: DisconnectReason): boolean {
  return isRetriable(r);
}

export function userMessage(r: DisconnectReason): string {
  switch (r) {
    case 'host_leave':
      return 'Host left the session';
    case 'idle_timeout':
      return 'Disconnected: idle timeout';
    case 'kicked':
      return 'You were kicked';
    case 'server_shutdown':
      return 'Server is shutting down';
    case 'client_quit':
      return 'You left the session';
    case 'network_error':
      return 'Network error';
  }
}

export function suggestsReturn(r: DisconnectReason): boolean {
  return r !== 'kicked' && r !== 'server_shutdown';
}
