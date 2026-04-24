import { describe, it, expect } from 'vitest';
import {
  spatialVolume,
  stereoPan,
  PROXIMITY_RADIUS,
  type VoiceSource,
  type Listener,
} from './voice_chat_spatial';

const listener: Listener = { x: 0, y: 0, z: 0, yaw: 0 };

describe('voice chat spatial', () => {
  it('close source loud', () => {
    const s: VoiceSource = { peerId: 'p', x: 1, y: 0, z: 0, volume: 1 };
    expect(spatialVolume(s, listener)).toBeGreaterThan(0.9);
  });

  it('far source silent', () => {
    const s: VoiceSource = { peerId: 'p', x: PROXIMITY_RADIUS + 10, y: 0, z: 0, volume: 1 };
    expect(spatialVolume(s, listener)).toBe(0);
  });

  it('pan right for source at +x', () => {
    const s: VoiceSource = { peerId: 'p', x: 5, y: 0, z: 0, volume: 1 };
    expect(stereoPan(s, listener)).toBeGreaterThan(0);
  });

  it('pan left for source at -x', () => {
    const s: VoiceSource = { peerId: 'p', x: -5, y: 0, z: 0, volume: 1 };
    expect(stereoPan(s, listener)).toBeLessThan(0);
  });

  it('co-located safe', () => {
    const s: VoiceSource = { peerId: 'p', x: 0, y: 0, z: 0, volume: 1 };
    expect(Number.isFinite(stereoPan(s, listener))).toBe(true);
  });
});
