export type Reason =
  | 'user_quit'
  | 'timeout'
  | 'kicked'
  | 'banned'
  | 'server_full'
  | 'version_mismatch'
  | 'protocol_error'
  | 'crash'
  | 'idle_kick';

export const USER_VISIBLE: Record<Reason, string> = {
  user_quit: 'You disconnected',
  timeout: 'Connection timed out',
  kicked: 'You were kicked',
  banned: 'You are banned',
  server_full: 'Server is full',
  version_mismatch: 'Version mismatch',
  protocol_error: 'Protocol error',
  crash: 'Server crashed',
  idle_kick: 'Idle too long',
};

export function isRetryable(r: Reason): boolean {
  return r === 'timeout' || r === 'server_full' || r === 'crash';
}
