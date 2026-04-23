// Multiplayer chat channels. Global + team + private. Rate-limited,
// profanity-filtered.

export type ChatChannel = 'global' | 'team' | 'private';

export interface ChatMessage {
  sender: string;
  channel: ChatChannel;
  recipient: string | null;
  text: string;
  timestampMs: number;
}

export function canSend(text: string): boolean {
  if (!text.trim()) return false;
  if (text.length > 256) return false;
  return true;
}

export function visibleTo(
  m: ChatMessage,
  viewer: string,
  viewerTeam: string | null,
  senderTeam: string | null,
): boolean {
  if (m.channel === 'global') return true;
  if (m.channel === 'private') return viewer === m.recipient || viewer === m.sender;
  // team channel
  return viewerTeam !== null && viewerTeam === senderTeam;
}

export function mentions(m: ChatMessage, playerName: string): boolean {
  return m.text.includes(`@${playerName}`);
}
