export interface ChatMsg {
  peerId: string;
  text: string;
  sentAtMs: number;
}

export interface SpamState {
  recentByPeer: Map<string, ChatMsg[]>;
}

export const WINDOW_MS = 5000;
export const MAX_MSGS_PER_WINDOW = 8;
export const DUPLICATE_WINDOW_MS = 10000;

export function classify(msg: ChatMsg, s: SpamState): 'ok' | 'duplicate' | 'flood' {
  const recent = s.recentByPeer.get(msg.peerId) ?? [];
  const filtered = recent.filter((m) => msg.sentAtMs - m.sentAtMs <= WINDOW_MS);
  if (filtered.length >= MAX_MSGS_PER_WINDOW) return 'flood';
  const duplicates = recent.filter(
    (m) => m.text === msg.text && msg.sentAtMs - m.sentAtMs <= DUPLICATE_WINDOW_MS,
  );
  if (duplicates.length > 0) return 'duplicate';
  return 'ok';
}

export function record(s: SpamState, msg: ChatMsg): void {
  const list = s.recentByPeer.get(msg.peerId) ?? [];
  list.push(msg);
  s.recentByPeer.set(
    msg.peerId,
    list.filter((m) => msg.sentAtMs - m.sentAtMs <= DUPLICATE_WINDOW_MS),
  );
}
