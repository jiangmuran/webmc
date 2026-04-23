import { describe, it, expect } from 'vitest';
import { isValidFrame, spatialGainForDistance } from './voice_chat_stub';

describe('voice chat stub', () => {
  it('valid 48k frame', () => {
    expect(
      isValidFrame({
        speakerId: 'p',
        sampleRate: 48000,
        frameMs: 20,
        payload: new Uint8Array([1, 2, 3]),
      }),
    ).toBe(true);
  });

  it('rejects weird sample rate', () => {
    expect(
      isValidFrame({
        speakerId: 'p',
        sampleRate: 44100,
        frameMs: 20,
        payload: new Uint8Array([1]),
      }),
    ).toBe(false);
  });

  it('empty payload rejected', () => {
    expect(
      isValidFrame({
        speakerId: 'p',
        sampleRate: 48000,
        frameMs: 20,
        payload: new Uint8Array([]),
      }),
    ).toBe(false);
  });

  it('gain 1 at 0', () => {
    expect(spatialGainForDistance(0, 10)).toBe(1);
  });

  it('gain 0 past radius', () => {
    expect(spatialGainForDistance(20, 10)).toBe(0);
  });
});
