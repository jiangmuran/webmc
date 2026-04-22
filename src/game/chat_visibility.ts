// Chat visibility settings. Per-player options to filter which chat
// messages their client displays. Host respects the setting and only
// forwards the minimum required message types.

export type ChatVisibility = 'full' | 'system_only' | 'hidden';

export interface ChatSettings {
  visibility: ChatVisibility;
  colorsEnabled: boolean;
  webLinksEnabled: boolean;
  commandSuggestions: boolean;
}

export function defaultChatSettings(): ChatSettings {
  return {
    visibility: 'full',
    colorsEnabled: true,
    webLinksEnabled: false,
    commandSuggestions: true,
  };
}

export type ChatMessageKind = 'player' | 'system' | 'command_feedback' | 'game_event';

export function shouldDeliverTo(settings: ChatSettings, kind: ChatMessageKind): boolean {
  switch (settings.visibility) {
    case 'hidden':
      return false;
    case 'system_only':
      return kind !== 'player';
    case 'full':
      return true;
  }
}

// Host-side: decide whether to broadcast a message to a specific peer
// based on their settings + the message's origin.
export interface DeliveryQuery {
  senderIsSelf: boolean;
  messageKind: ChatMessageKind;
  peerSettings: ChatSettings;
}

export function shouldBroadcastTo(q: DeliveryQuery): boolean {
  if (q.senderIsSelf) return true;
  return shouldDeliverTo(q.peerSettings, q.messageKind);
}

// Color stripping: if the peer has colorsEnabled=false, strip §<code>
// sequences before sending.
export function stripColors(msg: string): string {
  let out = '';
  for (let i = 0; i < msg.length; i++) {
    const ch = msg[i];
    if (ch === '§' && i + 1 < msg.length) {
      i++;
      continue;
    }
    out += ch ?? '';
  }
  return out;
}
