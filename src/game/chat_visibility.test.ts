import { describe, it, expect } from 'vitest';
import {
  defaultChatSettings,
  shouldBroadcastTo,
  shouldDeliverTo,
  stripColors,
} from './chat_visibility';

describe('chat visibility', () => {
  it('default is full', () => {
    expect(defaultChatSettings().visibility).toBe('full');
  });

  it('hidden rejects all', () => {
    const s = { ...defaultChatSettings(), visibility: 'hidden' as const };
    expect(shouldDeliverTo(s, 'player')).toBe(false);
    expect(shouldDeliverTo(s, 'system')).toBe(false);
  });

  it('system_only blocks player messages', () => {
    const s = { ...defaultChatSettings(), visibility: 'system_only' as const };
    expect(shouldDeliverTo(s, 'player')).toBe(false);
    expect(shouldDeliverTo(s, 'system')).toBe(true);
  });

  it('self messages always deliver', () => {
    expect(
      shouldBroadcastTo({
        senderIsSelf: true,
        messageKind: 'player',
        peerSettings: { ...defaultChatSettings(), visibility: 'hidden' },
      }),
    ).toBe(true);
  });

  it('stripColors removes §codes', () => {
    expect(stripColors('§chello§aworld')).toBe('helloworld');
  });

  it('empty string = empty', () => {
    expect(stripColors('')).toBe('');
  });
});
